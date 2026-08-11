/**
 * Derive a Midnight stagenet address (shielded and unshielded) from a hex seed —
 * no network calls, no wallet-facade startup, no state subscriptions. Both
 * addresses are pure functions of the seed's derived keys, so this never touches
 * the indexer, node, or proof server.
 *
 * Usage:
 *
 *   node scripts/derive-address.ts --seed=<64-hex>
 */

// Node needs the explicit .ts extension to load this at runtime, but tsc's "bundler"
// resolution rejects a .ts specifier unless allowImportingTsExtensions is set — and
// tsconfig.json is upstream's, so we resolve the URL at runtime instead of statically.
const seedlibUrl = new URL('../lib/midnight/seedlib.ts', import.meta.url).href;
const { deriveAccountKeys } = await import(seedlibUrl);

const {
  MidnightBech32m,
  ShieldedAddress,
  ShieldedCoinPublicKey,
  ShieldedEncryptionPublicKey,
} = await import('@midnightntwrk/wallet-sdk-address-format');

const NETWORK_ID = 'stagenet';

const die = (msg: string): never => {
  console.error(`\n✗ ${msg}`);
  process.exit(1);
};

function parseArgs(argv: string[]): { seed: string } {
  const seedFlag = argv.find(a => a.startsWith('--seed='))?.slice('--seed='.length);
  const seed = seedFlag?.trim() ?? '';
  if (!seed) die('No seed. Pass --seed=<64-hex>.');
  if (!/^[0-9a-fA-F]{64}$/.test(seed)) {
    die(`Seed must be 64 hex chars, got ${seed.length}.`);
  }
  return { seed };
}

function main(): void {
  const { seed } = parseArgs(process.argv.slice(2));

  const keys = deriveAccountKeys(seed, NETWORK_ID);

  const unshieldedAddress = keys.unshieldedKeystore.getBech32Address().toString();

  const shieldedAddress = new ShieldedAddress(
    ShieldedCoinPublicKey.fromHexString(keys.shieldedSecretKeys.coinPublicKey),
    ShieldedEncryptionPublicKey.fromHexString(keys.shieldedSecretKeys.encryptionPublicKey),
  );
  const encodedShielded = MidnightBech32m.encode(NETWORK_ID, shieldedAddress).toString();

  console.log(`\nSeed:               ${seed}`);
  console.log(`Unshielded address: ${unshieldedAddress}`);
  console.log(`Shielded address:   ${encodedShielded}`);
}

main();
