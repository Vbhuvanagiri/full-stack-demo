// The in-app seed wallet ("Developer wallet") + the midnight-js provider set around it.
import { FetchZkConfigProvider } from '@midnight-ntwrk/midnight-js-fetch-zk-config-provider';
import { indexerPublicDataProvider } from '@midnight-ntwrk/midnight-js-indexer-public-data-provider';
import { levelPrivateStateProvider } from '@midnight-ntwrk/midnight-js-level-private-state-provider';
import { findDeployedContract } from '@midnight-ntwrk/midnight-js/contracts';
import { setNetworkId } from '@midnight-ntwrk/midnight-js/network-id';
import * as CompiledContract from '@midnight-ntwrk/compact-js/effect/CompiledContract';

import {
  deriveAccountKeys,
  initialiseWalletFacade,
  createWalletAndMidnightProvider,
  createCrossContractProofServerProvider,
  type AccountKeys,
  type MidnightNodeConfig,
  type SerializedWalletState,
  type WalletFacade,
} from './seedlib';
import { Contract, witnesses, createVaultPrivateState } from './contract-exports';

export const VAULT_PRIVATE_STATE_ID = 'erc20-vault';

// Genesis dev seed: endowed on every fresh local chain, so addresses are stable.
export const GENESIS_SEED =
  '0000000000000000000000000000000000000000000000000000000000000001';

const walletSeed = (): string =>
  process.env.NEXT_PUBLIC_MIDNIGHT_SEED?.trim() || GENESIS_SEED;

function nodeConfig(networkId: string): MidnightNodeConfig {
  return {
    networkId: networkId as MidnightNodeConfig['networkId'],
    nodeUrl: process.env.NEXT_PUBLIC_MIDNIGHT_NODE_URL ?? 'http://127.0.0.1:9944',
    indexerUrl:
      process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_URL ??
      'http://127.0.0.1:8088/api/v3/graphql',
    indexerWsUrl:
      process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_WS_URL ??
      'ws://127.0.0.1:8088/api/v3/graphql/ws',
    proofServerUrl:
      process.env.NEXT_PUBLIC_MIDNIGHT_PROOF_SERVER_URL ?? 'http://127.0.0.1:6300',
  };
}

// Deterministic identity secret so the derived EVM deposit address is stable across
// reloads and cache clears: SHA-256(seed || "erc20-vault:identity").
async function identityFromSeed(seedHex: string): Promise<Uint8Array> {
  const seedBytes = Uint8Array.from(
    seedHex.match(/.{2}/g)!.map(h => parseInt(h, 16)),
  );
  const material = new Uint8Array([
    ...seedBytes,
    ...new TextEncoder().encode('erc20-vault:identity'),
  ]);
  return new Uint8Array(await crypto.subtle.digest('SHA-256', material));
}

// Minimal IndexedDB store for serialized wallet state (resync from a checkpoint
// instead of replaying the whole chain on every page load).
const IDB_NAME = 'midnight-wallet-cache';
const IDB_STORE = 'state';
function idb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => req.result.createObjectStore(IDB_STORE);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function idbGet(key: string): Promise<any> {
  const db = await idb();
  return new Promise(resolve => {
    const req = db.transaction(IDB_STORE).objectStore(IDB_STORE).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => resolve(undefined);
  });
}
async function idbSet(key: string, value: any): Promise<void> {
  const db = await idb();
  return new Promise(resolve => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}
async function idbDelete(key: string): Promise<void> {
  const db = await idb();
  return new Promise(resolve => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    tx.objectStore(IDB_STORE).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => resolve();
  });
}

// Where the ZK assets (keys/zkir/compiler) are served from. Defaults to the app origin (the
// public/ folder in local dev), but the vault provers are 100-280 MB each — over Vercel's 100 MB
// file cap — so in production they're hosted on object storage and NEXT_PUBLIC_ZK_CONFIG_ORIGIN
// points the fetch there. The `/signet` assets live under the same origin.
const ZK_ORIGIN =
  process.env.NEXT_PUBLIC_ZK_CONFIG_ORIGIN ||
  (typeof window !== 'undefined' ? window.location.origin : '');

// Compiled-contract binding: generated Contract + witnesses + zk assets at the origin.
const vaultCompiledContract: any = (CompiledContract.withCompiledFileAssets as any)(
  (CompiledContract.withWitnesses as any)(
    (CompiledContract.make as any)('erc20-vault', Contract as any),
    witnesses,
  ),
  ZK_ORIGIN,
);

// Proving spans BOTH zk roots (vault + signet) — deposit/withdraw cross-call.
function buildProviders(
  wallet: unknown,
  cfg: MidnightNodeConfig,
  accountId: string,
) {
  const zkOpts = { fetchFunc: fetch.bind(window) };
  const vaultZk = new FetchZkConfigProvider<string>(ZK_ORIGIN, zkOpts);
  const signetZk = new FetchZkConfigProvider<string>(`${ZK_ORIGIN}/signet`, zkOpts);

  return {
    privateStateProvider: levelPrivateStateProvider({
      privateStateStoreName: 'vault-private-states',
      signingKeyStoreName: 'vault-signing-keys',
      accountId,
      // Must satisfy validatePassword (>=16 chars, mixed classes).
      privateStoragePasswordProvider: () => '&*(BHJqwe419-erc20Vault',
    } as any),
    zkConfigProvider: vaultZk,
    proofProvider: createCrossContractProofServerProvider(cfg.proofServerUrl, [
      vaultZk,
      signetZk,
    ]),
    publicDataProvider: indexerPublicDataProvider({
      queryURL: cfg.indexerUrl,
      subscriptionURL: cfg.indexerWsUrl,
    } as any),
    walletProvider: wallet,
    midnightProvider: wallet,
  } as any;
}

export interface WalletHandle {
  providers: any;
  shielded: { shieldedAddress: string };
  identitySecret: Uint8Array;
  facade: WalletFacade;
  keys: AccountKeys;
  stop: () => Promise<void>;
}

// Build + start + sync the facade, then assemble the provider set around it. Restores
// from the cached checkpoint when present (delta sync); falls back to a full resync if
// the cached state is rejected. Reports sync progress via `onProgress`.
export async function initializeWallet(
  networkId: string,
  log: (m: string) => void,
  onProgress?: (status: string) => void,
): Promise<WalletHandle> {
  const cfg = nodeConfig(networkId);
  const seed = walletSeed();
  const cacheKey = `wallet:${networkId}:${seed.slice(0, 8)}`;

  log('Deriving keys from the wallet seed…');
  const keys = deriveAccountKeys(seed, cfg.networkId);

  let latestState: any;
  const track = (f: WalletFacade) => {
    try {
      (f as any).state?.().subscribe?.((s: any) => {
        latestState = s;
        try {
          // This SDK build never fills progress.highestIndex, so no percentage is
          // possible — show the live applied-update count instead.
          if (onProgress) {
            const p = s?.shielded?.progress;
            if (s?.isSynced) onProgress('synced');
            else if (p?.isConnected && p.appliedIndex > 0n)
              onProgress(`syncing (${p.appliedIndex} updates)`);
            else onProgress('connecting to indexer…');
          }
        } catch {
          /* progress is best-effort */
        }
      });
    } catch {
      /* progress is best-effort */
    }
  };

  const startFacade = async (restore?: SerializedWalletState) => {
    const f = await initialiseWalletFacade(keys, cfg, restore);
    await f.start(keys.shieldedSecretKeys, keys.dustSecretKey);
    track(f);
    return f;
  };

  const cached: SerializedWalletState | undefined = await idbGet(cacheKey);
  let facade: WalletFacade;
  let state: any;
  try {
    log(cached ? 'Resuming wallet from cached state…' : 'Starting the in-app wallet (syncing to the node)…');
    facade = await startFacade(cached);
    state = await facade.waitForSyncedState();
  } catch (e) {
    if (!cached) throw e;
    log('Cached wallet state rejected — resyncing from scratch…');
    await idbDelete(cacheKey);
    facade = await startFacade();
    state = await facade.waitForSyncedState();
  }
  log('Wallet synced.');

  // Checkpoint for the next load (best-effort).
  try {
    const [sh, un, du] = await Promise.all([
      (facade as any).shielded.serializeState(),
      (facade as any).unshielded.serializeState(),
      (facade as any).dust.serializeState(),
    ]);
    await idbSet(cacheKey, { shielded: sh, unshielded: un, dust: du });
  } catch {
    /* cache is best-effort */
  }

  // state.shielded.address is an object — bech32-encode for display.
  let shieldedAddress = '';
  try {
    const { MidnightBech32m } = await import(
      '@midnightntwrk/wallet-sdk-address-format'
    );
    shieldedAddress = MidnightBech32m.encode(
      cfg.networkId as any,
      state?.shielded?.address,
    ).toString();
  } catch {
    shieldedAddress = String(state?.shielded?.address ?? '');
  }

  const providers = buildProviders(
    createWalletAndMidnightProvider(facade, keys),
    cfg,
    shieldedAddress || 'seed-dev-wallet',
  );

  latestState ??= state;
  const current = async (): Promise<any> =>
    latestState ?? (latestState = await facade.waitForSyncedState());

  providers.balancesSource = {
    // Total (available + pending) so an in-flight spend's change still shows: a partial
    // withdraw consumes the whole UTXO and re-mints change, which is pending until synced.
    shielded: async () => {
      const sh = (await current()).shielded;
      try {
        return sh.capabilities.coinsAndBalances.getTotalBalances(sh.state);
      } catch {
        return sh?.balances ?? {};
      }
    },
    unshielded: async () => (await current()).unshielded?.balances ?? {},
    dust: async () => {
      const bal: any = (await current()).dust?.balance?.(new Date());
      const v = bal?.available ?? bal?.value ?? bal ?? 0n;
      return typeof v === 'bigint' ? v : BigInt(v ?? 0);
    },
  };

  return {
    providers,
    shielded: { shieldedAddress },
    identitySecret: await identityFromSeed(seed),
    facade,
    keys,
    stop: async () => {
      try {
        await (facade as any).stop?.();
      } catch {
        /* ignore */
      }
    },
  };
}

// Join the deployed vault with the identity secret as private state.
export async function joinVault(
  providers: any,
  contractAddress: string,
  secretKey: Uint8Array,
) {
  return (findDeployedContract as any)(providers, {
    contractAddress,
    compiledContract: vaultCompiledContract,
    privateStateId: VAULT_PRIVATE_STATE_ID,
    initialPrivateState: createVaultPrivateState(secretKey),
  });
}

export { setNetworkId };
