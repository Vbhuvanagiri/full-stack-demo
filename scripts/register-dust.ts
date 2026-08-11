/**
 * Register a seed wallet's NIGHT UTXOs for DUST generation on Midnight stagenet.
 *
 * A fresh wallet holding NIGHT still has 0 DUST: NIGHT only generates DUST once its UTXOs
 * are registered, and registration is its own signed transaction. The app never does this
 * (nothing in lib/ calls any registration API), so this script covers the gap.
 *
 * The chicken-and-egg problem — a registration costs a fee, but you have 0 DUST to pay it —
 * is solved by the ledger allowing a first-time registration to be paid out of the DUST its
 * own NIGHT inputs have already generated. The SDK exposes that as:
 *
 *   1. estimateRegistration(utxos)            -> { fee, dustGenerationEstimations }
 *   2. waitForGeneratedDust(utxos, fee)       -> waits until projected dust >= fee
 *   3. registerNightUtxosForDustGeneration()  -> builds + signs the registration tx
 *
 * Internally step 3 calls splitNightUtxosForDustRegistration(), which picks the guaranteed
 * UTXO whose generation pays the fee and computes the `feePayment` allowance. If that
 * allowance is short it throws "Insufficient generated dust to cover registration fee",
 * naming waitForGeneratedDust as the fix — which is why step 2 comes first. No separate
 * fee source is needed or used.
 *
 * Usage (two phases — it will not submit anything without --confirm):
 *
 *   node --env-file=.env.local scripts/register-dust.ts
 *   node --env-file=.env.local scripts/register-dust.ts --confirm
 *
 * Seed resolution, in order: --seed=<hex> | $SEED | $NEXT_PUBLIC_MIDNIGHT_SEED
 *
 *   node --env-file=.env.local scripts/register-dust.ts --seed=<64-hex> --confirm
 *
 * Requires the local proof server on :6300 (checked before anything else runs).
 */

// Node needs the explicit .ts extension to load this at runtime, but tsc's "bundler"
// resolution rejects a .ts specifier unless allowImportingTsExtensions is set — and
// tsconfig.json is upstream's, so we resolve the URL at runtime instead of statically.
const seedlibUrl = new URL('../lib/midnight/seedlib.ts', import.meta.url).href;
const { deriveAccountKeys, initialiseWalletFacade } = await import(seedlibUrl);

const NETWORK_ID = 'stagenet';
const PROOF_SERVER_URL =
  process.env.NEXT_PUBLIC_MIDNIGHT_PROOF_SERVER_URL ?? 'http://localhost:6300';

/** Hard ceiling on any single wallet-state subscription. The SDK streams state and never
 *  completes, so every read takes the first useful emission and unsubscribes. */
const STATE_TIMEOUT_MS = 60_000;
/** Bounded wait for the chain to generate enough dust to cover the registration fee.
 *  Not a state subscription — this is real chain time, so it gets its own budget. */
const DUST_GENERATION_TIMEOUT_MS = 300_000;
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

  // Effect errors implement toJSON; ledger/WASM errors often stash fields elsewhere.
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
  confirm: boolean;
  skipValidate: boolean;
} {
  const confirm = argv.includes('--confirm');
  const skipValidate = argv.includes('--skip-validate');
  const seedFlag = argv.find(a => a.startsWith('--seed='))?.slice('--seed='.length);
  const seed =
    seedFlag ?? process.env.SEED ?? process.env.NEXT_PUBLIC_MIDNIGHT_SEED ?? '';

  if (!seed) {
    die('No seed. Pass --seed=<64-hex>, or set $SEED / $NEXT_PUBLIC_MIDNIGHT_SEED (use --env-file=.env.local).');
  }
  if (!/^[0-9a-fA-F]{64}$/.test(seed.trim())) {
    die(`Seed must be 64 hex chars, got ${seed.trim().length}.`);
  }
  return { seed: seed.trim(), confirm, skipValidate };
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
    let sub: any;
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

    sub = facade.state().subscribe((s: any) => {
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

/** DUST balance is exposed as a bigint on some builds and {available|value} on others. */
async function readDust(state: any): Promise<bigint> {
  const raw = await state?.dust?.balance?.(new Date());
  const v = raw?.available ?? raw?.value ?? raw ?? 0n;
  return typeof v === 'bigint' ? v : BigInt(v ?? 0);
}

function readNightUtxos(state: any): any[] {
  const un = state?.unshielded;
  const coins = un?.capabilities?.coinsAndBalances?.getAvailableCoins?.(un.state);
  return coins ? [...coins] : [];
}

async function main(): Promise<void> {
  const { seed, confirm, skipValidate } = parseArgs(process.argv.slice(2));

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

  console.log(`\nseed      ${seed.slice(0, 8)}…${seed.slice(-4)}`);
  console.log(`network   ${NETWORK_ID}`);

  const keys = deriveAccountKeys(seed, NETWORK_ID);
  console.log(`NIGHT     ${keys.unshieldedKeystore.getBech32Address().toString()}`);

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
    // ---- Read current state (bounded) --------------------------------------------------
    const synced = await firstState(facade, s => s?.isSynced === true, 'first synced state');

    const nightBalances = synced.unshielded?.balances ?? {};
    const dustBefore = await readDust(synced);
    const utxos = readNightUtxos(synced);

    console.log('\n── before ──────────────────────────────────────────');
    console.log('NIGHT balances :', JSON.stringify(nightBalances, (_k, v) =>
      typeof v === 'bigint' ? v.toString() : v,
    ));
    console.log('DUST balance   :', dustBefore.toString());
    console.log(`NIGHT UTXOs    : ${utxos.length}`);

    if (utxos.length === 0) {
      console.error('\n✗ No NIGHT UTXOs to register. Fund the address above from the faucet first.');
      await finish(1);
    }

    for (const [i, u] of utxos.entries()) {
      const reg = u?.meta?.registeredForDustGeneration;
      console.log(
        `  [${i}] value=${String(u?.utxo?.value)} ` +
          `registeredForDustGeneration=${String(reg)} ` +
          `ctime=${u?.meta?.ctime instanceof Date ? u.meta.ctime.toISOString() : String(u?.meta?.ctime)} ` +
          `outputNo=${String(u?.utxo?.outputNo)}`,
      );
    }

    const unregistered = utxos.filter(u => u?.meta?.registeredForDustGeneration !== true);
    if (unregistered.length === 0) {
      console.log('\n✓ Every NIGHT UTXO is already registered for dust generation. Nothing to do.');
      console.log('  If DUST is still 0, it simply has not accrued yet — generation is time-based.');
      await finish(0);
    }
    console.log(`\n${unregistered.length} of ${utxos.length} UTXO(s) not yet registered.`);

    // ---- Estimate ----------------------------------------------------------------------
    const estimate = await facade.estimateRegistration(utxos);
    const fee: bigint = estimate.fee;
    console.log('\n── estimate ────────────────────────────────────────');
    console.log('registration fee (raw DUST):', fee.toString());
    const projections = estimate.dustGenerationEstimations ?? [];
    console.log(`dust generation projections: ${projections.length}`);
    for (const [i, p] of projections.entries()) {
      console.log(`  [${i}] ${JSON.stringify(p, (_k, v) => (typeof v === 'bigint' ? v.toString() : v)).slice(0, 300)}`);
    }
    console.log(
      '\nThis fee is paid by the DUST these same NIGHT inputs have already generated —\n' +
        'no external DUST is required, which is what makes a first registration possible at 0 balance.',
    );

    if (!confirm) {
      console.log('\n── stopping for confirmation ───────────────────────');
      console.log('Nothing has been changed or submitted. To proceed, re-run with --confirm:');
      console.log(`\n  node --env-file=.env.local scripts/register-dust.ts --confirm\n`);
      await finish(0);
    }

    // ---- Register ----------------------------------------------------------------------
    console.log('\n── registering ─────────────────────────────────────');
    console.log(`waiting for projected dust to reach the fee (max ${DUST_GENERATION_TIMEOUT_MS / 1000}s)…`);
    try {
      await facade.waitForGeneratedDust(utxos, fee, { timeoutMs: DUST_GENERATION_TIMEOUT_MS });
    } catch (e) {
      die(
        `Projected dust never reached the ${fee} fee within ${DUST_GENERATION_TIMEOUT_MS / 1000}s ` +
          `(${e instanceof Error ? e.message : String(e)}).\n` +
          '  DUST accrues over time from held NIGHT — wait longer and re-run with --confirm.',
      );
    }
    console.log('✓ projected dust covers the fee');

    const recipe = await facade.registerNightUtxosForDustGeneration(
      utxos,
      keys.unshieldedKeystore.getPublicKey(),
      keys.unshieldedKeystore.signDataAsync,
    );
    console.log('✓ registration transaction built and signed');

    console.log(`proving via ${PROOF_SERVER_URL} (this can take a while)…`);
    const finalized = await facade.finalizeRecipe(recipe);
    console.log('✓ proved');

    if (skipValidate) {
      console.log('⚠ skipping pre-submit validation (--skip-validate)');
    } else {
      try {
        // enforceBalancing is deliberately FALSE here, against the SDK's general
        // recommendation of all-true before submitTransaction (midnight-wallet#325).
        //
        // validateTransaction runs tx.wellFormed() against LedgerState.blank(networkId).
        // A dust registration carries `spends: []` and pays its fee purely from the DUST
        // its own NIGHT inputs have back-credited on chain (midnight-wallet#415). A blank
        // ledger state has no such history, so the balancing check always sees "0
        // available" and rejects a registration that the real chain would accept. The
        // check is structurally inapplicable to this transaction type — it is not
        // evidence of a malformed tx. Structure, signatures and limits are still enforced.
        await facade.validateTransaction(finalized, {
          flags: { enforceBalancing: false, verifySignatures: true, enforceLimits: true },
        });
        console.log('✓ validated (structure, signatures, limits; balancing skipped — see comment)');
      } catch (e) {
        dumpError('validateTransaction failed', e);

        console.error(
          '\nStructure/signature/limit validation failed — this is NOT the known blank-ledger\n' +
            'balancing artifact (that check is already disabled above). Something is genuinely\n' +
            'wrong with the transaction. Use --skip-validate only if you want the node to judge.',
        );
        await finish(1);
      }
    }

    const txId = await facade.submitTransaction(finalized);
    console.log(`\n✓ submitted — tx id: ${txId}`);

    // ---- Confirm DUST arrives (bounded) ------------------------------------------------
    console.log(`\n── polling for DUST > 0 (${POLL_ATTEMPTS} attempts, ${POLL_DELAY_MS / 1000}s apart) ──`);
    for (let attempt = 1; attempt <= POLL_ATTEMPTS; attempt++) {
      await sleep(POLL_DELAY_MS);
      let dust = 0n;
      try {
        const s = await firstState(facade, st => st?.isSynced === true, `poll ${attempt} synced state`);
        dust = await readDust(s);
      } catch (e) {
        console.log(`  [${attempt}/${POLL_ATTEMPTS}] state read failed: ${e instanceof Error ? e.message : String(e)}`);
        continue;
      }
      console.log(`  [${attempt}/${POLL_ATTEMPTS}] DUST = ${dust.toString()}`);
      if (dust > 0n) {
        console.log(`\n✓ DUST is now ${dust.toString()} — registration confirmed. Deposits should balance.`);
        await finish(0);
      }
    }

    die(
      `DUST still 0 after ${POLL_ATTEMPTS} attempts (~${(POLL_ATTEMPTS * POLL_DELAY_MS) / 1000}s).\n` +
        `  The registration tx (${txId}) may still be settling, or generation may need more time.\n` +
        '  Re-run without --confirm to re-read the registeredForDustGeneration flags.',
    );
  } catch (e) {
    console.error(`\n✗ ${e instanceof Error ? e.stack ?? e.message : String(e)}`);
    await finish(1);
  }
}

await main();
