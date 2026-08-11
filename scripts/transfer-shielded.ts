/**
 * Transfer shielded vault tokens (e.g. USDC) between two Midnight identities via Zswap.
 *
 * Dry-run by default: syncs the source wallet, shows the balance and the intended
 * transfer, and exits without submitting anything. Pass --confirm to actually build,
 * prove, and submit the shielded transfer.
 *
 * The vault token "color" is derived exactly as the app does it (lib/midnight/vault.ts
 * vaultTokenType): rawTokenType(vaultTokenDomainSeparator(erc20Address), vaultContractAddress).
 * The SDK's coin selection handles UTXO splitting/change internally — callers only ever
 * specify destination + color + amount, never individual coins.
 *
 * Usage (two phases — it will not submit anything without --confirm):
 *
 *   node --env-file=.env.local scripts/transfer-shielded.ts \
 *     --seed=<source-64-hex> --to=<mn_shield-addr_stagenet1...> \
 *     --token=<erc20-address> --amount=<raw-amount>
 *
 *   node --env-file=.env.local scripts/transfer-shielded.ts \
 *     --seed=<source-64-hex> --to=<mn_shield-addr_stagenet1...> \
 *     --token=<erc20-address> --amount=<raw-amount> --confirm
 *
 * Optional: --vault=<64-hex vault contract address> overrides
 * NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS / the hardcoded stagenet default.
 *
 * Requires the local proof server on :6300 (checked before anything else runs).
 */

// Node needs the explicit .ts extension to load these at runtime, but tsc's "bundler"
// resolution rejects a .ts specifier unless allowImportingTsExtensions is set — and
// tsconfig.json is upstream's, so we resolve the URL at runtime instead of statically.
const seedlibUrl = new URL('../lib/midnight/seedlib.ts', import.meta.url).href;
const { deriveAccountKeys, initialiseWalletFacade } = await import(seedlibUrl);

// lib/midnight/vault.ts's own vaultTokenType() can't be imported directly here: it pulls
// in sibling relative imports (./flow, ./evm-swap, ...) without file extensions, which only
// resolve under bundler/Next.js resolution, not Node's native ESM loader. contract-exports.ts
// is safe (its one relative import already carries an explicit .js), so this replicates
// vaultTokenType()'s exact formula from lib/midnight/vault.ts against the same primitives.
const contractExportsUrl = new URL('../lib/midnight/contract-exports.ts', import.meta.url).href;
const { pureCircuits } = await import(contractExportsUrl);
const { rawTokenType } = await import('@midnight-ntwrk/compact-runtime');
const { hexToBytes, stripHexPrefix, bytesToHex } = await import('@sig-net/midnight');

const { MidnightBech32m, ShieldedAddress } = await import(
  '@midnightntwrk/wallet-sdk-address-format'
);

/** Mirrors lib/midnight/vault.ts's vaultTokenType() exactly. */
function vaultTokenType(erc20Hex: string, vaultContractAddress: string): string {
  const addrBytes = hexToBytes(stripHexPrefix(erc20Hex));
  const raw: any = rawTokenType(
    (pureCircuits as any).vaultTokenDomainSeparator(addrBytes),
    vaultContractAddress as any,
  );
  return (typeof raw === 'string' ? raw : bytesToHex(raw))
    .replace(/^0x/, '')
    .toLowerCase();
}

const NETWORK_ID = 'stagenet';
const PROOF_SERVER_URL =
  process.env.NEXT_PUBLIC_MIDNIGHT_PROOF_SERVER_URL ?? 'http://localhost:6300';
// Matches .env.example's NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS.
const DEFAULT_VAULT_CONTRACT_ADDRESS =
  '2db89e1ad65ced6305746d678fc70518bb6178daa3b8c2480ce4dbec1b8ba74e';

/** Hard ceiling on any single wallet-state subscription. The SDK streams state and never
 *  completes, so every read takes the first useful emission and unsubscribes. Proofs are
 *  slow, so the initial balance wait gets a generous budget. */
const STATE_TIMEOUT_MS = 120_000;
/** Post-submit confirmation poll. */
const POLL_ATTEMPTS = 10;
const POLL_DELAY_MS = 6_000;

const die = (msg: string): never => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};

const sleep = (ms: number): Promise<void> =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Print everything an error carries. Effect's Data.TaggedError (WellFormedError et al.)
 * puts the real detail in `.cause` and exposes a `_tag`; a plain stack trace loses both.
 */
function dumpError(label: string, err: unknown, depth = 0): void {
  const pad = '  '.repeat(depth);
  if (depth === 0) console.error(`\n✗ ${label}`);
  else console.error(`${pad}── ${label} ──`);

  if (err === null || err === undefined) {
    console.error(`${pad}  ${String(err)}`);
    return;
  }
  if (typeof err !== 'object') {
    console.error(`${pad}  ${typeof err}: ${String(err)}`);
    return;
  }

  const e = err as Record<string, unknown>;
  console.error(`${pad}  constructor : ${(err as object).constructor?.name}`);
  if ('_tag' in e) console.error(`${pad}  _tag        : ${String(e._tag)}`);
  if ('name' in e) console.error(`${pad}  name        : ${String(e.name)}`);
  if ('message' in e) console.error(`${pad}  message     : ${String(e.message)}`);
  console.error(`${pad}  toString    : ${String(err)}`);

  const maybeJson = e as { toJSON?: () => unknown };
  if (typeof maybeJson.toJSON === 'function') {
    try {
      console.error(`${pad}  toJSON      : ${JSON.stringify(maybeJson.toJSON(), null, 2)}`);
    } catch {
      /* not serialisable */
    }
  }

  const skip = new Set(['stack', 'cause', 'message', 'name', '_tag']);
  const own = [
    ...Object.getOwnPropertyNames(err),
    ...Object.getOwnPropertySymbols(err).map(String),
  ].filter(k => !skip.has(k));
  if (own.length > 0) {
    console.error(`${pad}  own fields  : ${own.join(', ')}`);
    for (const k of own) {
      let v: unknown;
      try {
        v = e[k];
      } catch {
        continue;
      }
      if (typeof v === 'function') continue;
      let rendered: string;
      try {
        rendered = typeof v === 'object' && v !== null
          ? JSON.stringify(v, (_k, vv) => (typeof vv === 'bigint' ? vv.toString() : vv))
          : String(v);
      } catch {
        rendered = String(v);
      }
      console.error(`${pad}    ${k} = ${rendered?.slice(0, 600)}`);
    }
  }

  if ('stack' in e && e.stack) {
    console.error(`${pad}  stack       :\n${String(e.stack)}`);
  }
  if ('cause' in e && e.cause !== undefined && depth < 4) {
    dumpError('cause', e.cause, depth + 1);
  }
}

function parseArgs(argv: string[]): {
  seed: string;
  to: string;
  token: string;
  amount: bigint;
  confirm: boolean;
  vault: string | undefined;
} {
  const flag = (name: string): string | undefined =>
    argv.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3);
  const confirm = argv.includes('--confirm');

  const seed = flag('seed')?.trim() ?? '';
  if (!seed) die('Missing --seed=<source-64-hex>.');
  if (!/^[0-9a-fA-F]{64}$/.test(seed)) die(`Seed must be 64 hex chars, got ${seed.length}.`);

  const to = flag('to')?.trim() ?? '';
  if (!to) die('Missing --to=<mn_shield-addr_stagenet1...>.');

  const token = flag('token')?.trim() ?? '';
  if (!/^(0x)?[0-9a-fA-F]{40}$/.test(token)) {
    die(`--token must be a 20-byte hex ERC20 address, got "${token}".`);
  }

  const amountRaw = flag('amount')?.trim() ?? '';
  if (!/^[0-9]+$/.test(amountRaw)) die(`--amount must be a non-negative integer, got "${amountRaw}".`);
  const amount = BigInt(amountRaw);
  if (amount <= 0n) die('--amount must be greater than zero.');

  const vault = flag('vault')?.trim();
  if (vault !== undefined && !/^(0x)?[0-9a-fA-F]{64}$/.test(vault)) {
    die(`--vault must be a 32-byte hex contract address, got "${vault}".`);
  }

  return { seed, to, token, amount, confirm, vault };
}

async function assertProofServerUp(): Promise<void> {
  const url = `${PROOF_SERVER_URL.replace(/\/$/, '')}/health`;
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(8_000) });
    if (!res.ok) die(`Proof server at ${PROOF_SERVER_URL} returned HTTP ${res.status}.`);
    console.log(`✓ proof server up at ${PROOF_SERVER_URL}`);
  } catch (e) {
    die(
      `Proof server not reachable at ${PROOF_SERVER_URL} (${e instanceof Error ? e.message : String(e)}).\n` +
        '  Start it with:\n' +
        '  docker run -p 6300:6300 midnightntwrk/proof-server:9.0.0-rc.5_experimental midnight-proof-server -v',
    );
  }
}

/**
 * Take the first state emission satisfying `predicate`, then unsubscribe. Rejects loudly
 * on timeout rather than reporting a possibly-stale read.
 */
function firstState(
  facade: any,
  predicate: (s: any) => boolean,
  label: string,
  timeoutMs: number = STATE_TIMEOUT_MS,
): Promise<any> {
  return new Promise((resolve, reject) => {
    let settled = false;
    const cleanup = () => {
      try {
        sub?.unsubscribe?.();
      } catch {
        /* already torn down */
      }
    };
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      cleanup();
      reject(new Error(`TIMEOUT after ${timeoutMs}ms waiting for: ${label}`));
    }, timeoutMs);

    const sub = facade.state().subscribe((s: any) => {
      if (settled) return;
      let ok = false;
      try {
        ok = predicate(s);
      } catch {
        ok = false;
      }
      if (!ok) return;
      settled = true;
      clearTimeout(timer);
      cleanup();
      resolve(s);
    });
  });
}

/** Shielded balance of one token color. Prefers the coin-selection capability (matches
 *  lib/midnight/wallet.ts's balancesSource.shielded) so pending change is included;
 *  falls back to the plain balances getter if the capability throws. */
function readColorBalance(facadeState: any, color: string): bigint {
  const sh = facadeState?.shielded;
  try {
    const totals = sh?.capabilities?.coinsAndBalances?.getTotalBalances(sh.state);
    if (totals) return totals[color] ?? 0n;
  } catch {
    /* fall through */
  }
  return sh?.balances?.[color] ?? 0n;
}

async function main(): Promise<void> {
  const { seed, to, token, amount, confirm, vault } = parseArgs(process.argv.slice(2));

  await assertProofServerUp();

  const cfg = {
    networkId: NETWORK_ID,
    indexerUrl: process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_URL,
    indexerWsUrl: process.env.NEXT_PUBLIC_MIDNIGHT_INDEXER_WS_URL,
    nodeUrl: process.env.NEXT_PUBLIC_MIDNIGHT_NODE_URL,
    proofServerUrl: PROOF_SERVER_URL,
  };
  for (const [k, v] of Object.entries(cfg)) {
    if (!v) die(`Missing config: ${k}. Run with --env-file=.env.local.`);
  }

  const vaultContractAddress =
    vault ?? process.env.NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS ?? DEFAULT_VAULT_CONTRACT_ADDRESS;
  const color: string = vaultTokenType(token, vaultContractAddress);

  let receiverAddress: any;
  try {
    receiverAddress = MidnightBech32m.parse(to).decode(ShieldedAddress, NETWORK_ID as any);
  } catch (e) {
    die(`Invalid --to shielded address "${to}": ${e instanceof Error ? e.message : String(e)}`);
  }

  console.log(`\nseed      ${seed.slice(0, 8)}…${seed.slice(-4)}`);
  console.log(`network   ${NETWORK_ID}`);
  console.log(`vault     ${vaultContractAddress}`);
  console.log(`token     ${token}`);
  console.log(`color     ${color}`);
  console.log(`to        ${to}`);
  console.log(`amount    ${amount}`);

  const keys = deriveAccountKeys(seed, NETWORK_ID);
  const facade = await initialiseWalletFacade(keys, cfg);
  await facade.start(keys.shieldedSecretKeys, keys.dustSecretKey);

  const finish = async (code: number): Promise<never> => {
    try {
      await facade.stop?.();
    } catch {
      /* best effort */
    }
    process.exit(code);
  };

  try {
    // ---- Sync (bounded) — wait until the source's balance carries this color -----------
    console.log('\nSyncing wallet…');
    const synced = await firstState(
      facade,
      s => s?.isSynced === true && readColorBalance(s, color) > 0n,
      `balance of color ${color} > 0`,
      STATE_TIMEOUT_MS,
    );

    const before = readColorBalance(synced, color);
    console.log(`Balance: ${before} of token ${color}`);

    if (before < amount) {
      console.error(
        `\n✗ Insufficient balance: have ${before}, need ${amount} of color ${color}.`,
      );
      await finish(1);
    }

    console.log('\n── intended transfer ───────────────────────────────');
    console.log(`  from   (this seed's shielded wallet)`);
    console.log(`  to     ${to}`);
    console.log(`  token  ${token} (color ${color})`);
    console.log(`  amount ${amount}`);

    if (!confirm) {
      console.log('\n── dry run — nothing submitted ─────────────────────');
      console.log('Re-run with --confirm to execute:');
      console.log(
        `\n  node --env-file=.env.local scripts/transfer-shielded.ts --seed=${seed} --to=${to} --token=${token} --amount=${amount} --confirm\n`,
      );
      await finish(0);
    }

    // ---- Build, prove, validate, submit -------------------------------------------------
    const ttl = new Date(Date.now() + 30 * 60 * 1000);
    console.log('\nSubmitting transfer…');
    const recipe = await facade.transferTransaction(
      [
        {
          type: 'shielded',
          outputs: [{ type: color, receiverAddress, amount }],
        },
      ],
      { shieldedSecretKeys: keys.shieldedSecretKeys, dustSecretKey: keys.dustSecretKey },
      { ttl, payFees: true },
    );

    console.log(`proving via ${PROOF_SERVER_URL} (this can take a while)…`);
    const finalized = await facade.finalizeRecipe(recipe);
    console.log('✓ proved');

    try {
      await facade.validateTransaction(finalized, {
        flags: { enforceBalancing: true, verifySignatures: true, enforceLimits: true },
      });
      console.log('✓ validated (balancing, signatures, limits)');
    } catch (e) {
      dumpError('validateTransaction failed', e);
      await finish(1);
    }

    const txId = await facade.submitTransaction(finalized);
    console.log(`✓ submitted — tx id: ${txId}`);

    // ---- Wait for confirmation (bounded) — poll until the balance reflects the send ----
    console.log(`\n── waiting for confirmation (${POLL_ATTEMPTS} attempts, ${POLL_DELAY_MS / 1000}s apart) ──`);
    let after = before;
    let confirmed = false;
    for (let attempt = 1; attempt <= POLL_ATTEMPTS; attempt++) {
      await sleep(POLL_DELAY_MS);
      try {
        const s = await firstState(facade, st => st?.isSynced === true, `confirm poll ${attempt}`);
        after = readColorBalance(s, color);
      } catch (e) {
        console.log(`  [${attempt}/${POLL_ATTEMPTS}] state read failed: ${e instanceof Error ? e.message : String(e)}`);
        continue;
      }
      console.log(`  [${attempt}/${POLL_ATTEMPTS}] balance = ${after}`);
      if (after <= before - amount) {
        confirmed = true;
        break;
      }
    }

    if (confirmed) {
      console.log(`\nConfirmed: tx ${txId}`);
    } else {
      console.log(
        `\n⚠ Balance did not reflect the send after ${POLL_ATTEMPTS} attempts — tx ${txId} may still be settling.`,
      );
    }

    console.log('\n── result ──────────────────────────────────────────');
    console.log(`source balance before : ${before}`);
    console.log(`source balance after  : ${after}`);
    console.log(`destination           : ${to}`);
    console.log(`amount transferred    : ${amount}`);
    console.log(`token color           : ${color}`);
    console.log(`tx id                 : ${txId}`);

    await finish(confirmed ? 0 : 1);
  } catch (e) {
    dumpError('transfer failed', e);
    await finish(1);
  }
}

await main();
