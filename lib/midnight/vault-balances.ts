import { erc20Balance, vaultTokenType, type Env } from './vault';
import { fetchErc20Decimals } from '@/lib/constants/token-metadata';

export interface MidnightTokenBalance {
  vaultUnits: bigint; // shielded vault-token balance (Midnight side)
  depositUnits: bigint; // ERC-20 at the deposit address (Sepolia)
  vaultPoolUnits: bigint; // ERC-20 pool at the vault payout address
  decimals: number;
}

export interface MidnightBalances {
  night: bigint;
  dust: bigint; // pays Midnight fees
  perToken: Record<string, MidnightTokenBalance>; // key: erc20 address (lowercase)
}

// Per supported ERC-20: the shielded vault-token balance (Midnight) plus the real Sepolia
// balances at the derived deposit/vault addresses. NIGHT + dust are wallet-wide.
export async function readBalances(
  providers: any,
  env: Env,
  tokens: string[],
  depAddr: string,
  vAddr: string,
): Promise<MidnightBalances> {
  const src = providers.balancesSource;
  let night = 0n;
  let dust = 0n;
  let shielded: Record<string, any> = {};
  try {
    const [d, unsh, sh] = await Promise.all([src.dust(), src.unshielded(), src.shielded()]);
    dust = d;
    night = Object.values(unsh ?? {}).reduce((a: bigint, b: any) => a + BigInt(b ?? 0), 0n);
    shielded = sh ?? {};
  } catch {
    /* leave zero */
  }
  const shieldedByType = Object.fromEntries(
    Object.entries(shielded).map(([k, v]) => [k.toLowerCase().replace(/^0x/, ''), v]),
  );

  const perToken: MidnightBalances['perToken'] = {};
  for (const erc20 of tokens) {
    let vaultUnits = 0n;
    try {
      vaultUnits = BigInt(shieldedByType[vaultTokenType(erc20, env.contractAddress)] ?? 0);
    } catch {
      /* leave zero */
    }

    let depositUnits = 0n;
    let vaultPoolUnits = 0n;
    try {
      [depositUnits, vaultPoolUnits] = await Promise.all([
        depAddr ? erc20Balance(env.evmRpcUrl, erc20, depAddr) : Promise.resolve(0n),
        vAddr ? erc20Balance(env.evmRpcUrl, erc20, vAddr) : Promise.resolve(0n),
      ]);
    } catch {
      /* keep zero */
    }

    // Decimals fetched on-chain (cached), never hardcoded.
    let decimals = 18;
    try {
      decimals = await fetchErc20Decimals(erc20);
    } catch {
      /* fall back */
    }
    perToken[erc20.toLowerCase()] = { vaultUnits, depositUnits, vaultPoolUnits, decimals };
  }

  return { night, dust, perToken };
}
