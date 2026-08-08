// Seed-wallet plumbing, trimmed from midnight-examples packages/lib (the
// wallet-sdk-only pieces): key derivation, WalletFacade construction, and the
// midnight-js provider adapters.
import * as ledger from '@midnightntwrk/ledger-v9';
import { HDWallet, Roles } from '@midnightntwrk/wallet-sdk-hd';
import {
  mergeWalletEntries,
  WalletEntrySchema,
  WalletFacade,
} from '@midnightntwrk/wallet-sdk-facade';
import { ShieldedWallet } from '@midnightntwrk/wallet-sdk-shielded';
import { DustWallet } from '@midnightntwrk/wallet-sdk-dust-wallet';
import {
  createKeystore,
  PublicKey as UnshieldedPublicKey,
  type UnshieldedKeystore,
  UnshieldedWallet,
} from '@midnightntwrk/wallet-sdk-unshielded-wallet';
import { InMemoryTransactionHistoryStorage } from '@midnightntwrk/wallet-sdk-abstractions';
import {
  createProofProvider,
  ZKConfigRegistry,
  zkConfigToProvingKeyMaterial,
  type MidnightProvider,
  type ProofProvider,
  type UnboundTransaction,
  type WalletProvider,
  type ZKConfigProvider,
} from '@midnight-ntwrk/midnight-js/types';
import { httpClientProvingProvider } from '@midnight-ntwrk/midnight-js-http-client-proof-provider';
import type { ProvingKeyMaterial, ProvingProvider } from '@midnightntwrk/ledger-v9';

export type { WalletFacade } from '@midnightntwrk/wallet-sdk-facade';

export type NetworkId = 'undeployed' | 'stagenet' | 'preview' | 'preprod' | 'mainnet';

export interface MidnightNodeConfig {
  readonly networkId: NetworkId;
  readonly indexerUrl: string;
  readonly indexerWsUrl: string;
  readonly nodeUrl: string;
  readonly proofServerUrl: string;
}

/** The live key material for one account. Reused for signing / balancing. */
export interface AccountKeys {
  shieldedSecretKeys: ledger.ZswapSecretKeys;
  dustSecretKey: ledger.DustSecretKey;
  unshieldedKeystore: UnshieldedKeystore;
}

// Fee overhead: the wallet sdk prices a proof-erased tx while the node prices
// real proof bytes; without this the node rejects with BalanceCheckOverspend.
// Mirrors @sig-net/midnight-contract-deploy's wallet plumbing.
const COST_PARAMETERS = {
  additionalFeeOverhead: 50_000_000_000_000n,
  feeBlocksMargin: 5,
};

const hexToBytes = (hex: string): Uint8Array => {
  const compact = hex.trim().replace(/^0x/i, '');
  if (!/^[0-9a-fA-F]+$/.test(compact) || compact.length % 2 !== 0) {
    throw new Error('Seed must be hex.');
  }
  return Uint8Array.from(compact.match(/.{2}/g)!.map(h => parseInt(h, 16)));
};

/** Derive the three role keys (Zswap / NightExternal / Dust) from a hex seed. */
export function deriveAccountKeys(seed: string, networkId: NetworkId): AccountKeys {
  const hd = HDWallet.fromSeed(hexToBytes(seed));
  if (hd.type !== 'seedOk') throw new Error('HDWallet.fromSeed failed (seedError).');

  const derived = hd.hdWallet
    .selectAccount(0)
    .selectRoles([Roles.Zswap, Roles.NightExternal, Roles.Dust])
    .deriveKeysAt(0);
  if (derived.type !== 'keysDerived') throw new Error('deriveKeysAt failed (keyOutOfBounds).');
  hd.hdWallet.clear();

  return {
    shieldedSecretKeys: ledger.ZswapSecretKeys.fromSeed(derived.keys[Roles.Zswap]),
    dustSecretKey: ledger.DustSecretKey.fromSeed(derived.keys[Roles.Dust]),
    unshieldedKeystore: createKeystore(
      { kind: 'schnorr', secret: derived.keys[Roles.NightExternal] },
      networkId,
    ),
  };
}

/** Serialized per-wallet checkpoints for fast resume. */
export interface SerializedWalletState {
  shielded: string;
  unshielded: string;
  dust: string;
}

/** Construct (not start) the WalletFacade; resume from `restore` when given. */
export function initialiseWalletFacade(
  keys: AccountKeys,
  config: MidnightNodeConfig,
  restore?: SerializedWalletState,
): Promise<WalletFacade> {
  return WalletFacade.init({
    configuration: {
      networkId: config.networkId,
      indexerClientConnection: {
        indexerHttpUrl: config.indexerUrl,
        indexerWsUrl: config.indexerWsUrl,
      },
      provingServerUrl: new URL(config.proofServerUrl),
      // The facade talks to the node over WebSocket, so flip http(s) -> ws(s).
      relayURL: new URL(config.nodeUrl.replace(/^http/, 'ws')),
      costParameters: COST_PARAMETERS,
      txHistoryStorage: new InMemoryTransactionHistoryStorage(WalletEntrySchema, mergeWalletEntries),
    },
    shielded: cfg =>
      restore
        ? ShieldedWallet(cfg).restore(restore.shielded)
        : ShieldedWallet(cfg).startWithSecretKeys(keys.shieldedSecretKeys),
    unshielded: cfg =>
      restore
        ? UnshieldedWallet(cfg).restore(restore.unshielded)
        : UnshieldedWallet(cfg).startWithPublicKey(UnshieldedPublicKey.fromKeyStore(keys.unshieldedKeystore)),
    dust: cfg =>
      restore
        ? DustWallet(cfg).restore(restore.dust)
        : DustWallet(cfg).startWithSecretKey(keys.dustSecretKey, ledger.LedgerParameters.initialParameters().dust),
  });
}

// Balancing recipes expire 30 min out.
const BALANCE_TTL_MS = 30 * 60 * 1000;

/** Adapt a started facade + keys to midnight-js's WalletProvider & MidnightProvider. */
export function createWalletAndMidnightProvider(
  facade: WalletFacade,
  keys: AccountKeys,
): WalletProvider & MidnightProvider {
  return {
    getCoinPublicKey: () => keys.shieldedSecretKeys.coinPublicKey,
    getEncryptionPublicKey: () => keys.shieldedSecretKeys.encryptionPublicKey,
    async balanceTx(tx: UnboundTransaction, ttl?: Date) {
      const recipe = await facade.balanceUnboundTransaction(
        tx as never,
        { shieldedSecretKeys: keys.shieldedSecretKeys, dustSecretKey: keys.dustSecretKey },
        { ttl: ttl ?? new Date(Date.now() + BALANCE_TTL_MS) },
      );
      const signed = await facade.signRecipe(recipe, keys.unshieldedKeystore.signDataAsync);
      return (await facade.finalizeRecipe(signed)) as never;
    },
    submitTx: tx => facade.submitTransaction(tx as never) as never,
  };
}

/**
 * Proof provider whose key resolution spans a SET of compiled contracts — a
 * cross-contract call (vault -> signet) proves the whole call tree, so both zk
 * roots must resolve. Also grafts on the `lookupKey` that ledger-v9 1.0.0-rc.3
 * requires but midnight-js 5.0.0-beta.4's httpClientProofProvider (built
 * against rc.2) lacks; drop once midnight-js catches up.
 */
export function createCrossContractProofServerProvider(
  proofServerUrl: string,
  zkConfigProviders: readonly ZKConfigProvider<string>[],
): ProofProvider {
  const registry = new ZKConfigRegistry([...zkConfigProviders]);
  // The base's key resolution special-cases a registry, which /check needs to
  // find CALLEE circuit keys. Timeout raised: cross-contract proves take minutes.
  const base = httpClientProvingProvider(
    proofServerUrl,
    registry as unknown as ZKConfigProvider<string>,
    { timeout: 15 * 60 * 1000 },
  );
  const lookupKey = async (keyLocation: string): Promise<ProvingKeyMaterial | undefined> => {
    const resolved = await registry.resolveKeyLocation(keyLocation);
    if (resolved !== undefined) return zkConfigToProvingKeyMaterial(resolved);
    // Bare circuit names: try each provider; protocol builtins resolve undefined.
    for (const provider of zkConfigProviders) {
      try {
        return zkConfigToProvingKeyMaterial(await provider.get(keyLocation));
      } catch {
        /* try next */
      }
    }
    return undefined;
  };
  const provingProvider: ProvingProvider = { ...base, lookupKey };
  return createProofProvider(provingProvider);
}
