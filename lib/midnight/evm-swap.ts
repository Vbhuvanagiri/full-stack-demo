// Uniswap V3 constants + a read-only QuoterV2 quote for the swap leg. Mirrors the
// reference integration tests' evm-swap.ts. The router is what the vault's approveRouter
// grants an allowance to and what a swap targets; the quoter is a read-only price oracle.
import { Contract as EthersContract, JsonRpcProvider } from 'ethers';
import {
  MPC_PARAMS_BYTES,
  MPCDestination,
  MPCSignatureAlgorithm,
  asciiPadded,
} from '@sig-net/midnight';

// Uniswap V3 on Sepolia (also present on a Sepolia fork).
export const UNISWAP_SWAP_ROUTER_02 =
  '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E';
export const UNISWAP_QUOTER_V2 = '0xEd1f6473345F45b75F8179591dd5bA1888cf2FB3';
export const UNISWAP_V3_FACTORY = '0x0227628f3F023bb0B980b67D528571c95c6DaC1c';

// exactOutputSingle((address,address,uint24,address,uint256,uint256,uint160)) -> uint256 amountIn.
export const EXACT_OUTPUT_SINGLE_SELECTOR = new Uint8Array([
  0x50, 0x23, 0xb4, 0xdf,
]);
// approve(address,uint256) -> bool.
export const APPROVE_SELECTOR = new Uint8Array([0x09, 0x5e, 0xa7, 0xb3]);
// Effectively-unlimited allowance (matches the contract's approveRouter, 2^128-1).
export const MAX_APPROVE = 340282366920938463463374607431768211455n;

// A V3 single-hop swap is ~120-200k gas, but an exact-output swap across a thin/fragmented pool
// crosses many ticks, so the cap has headroom. Must match the contract's fixed swap gas envelope.
export const SWAP_GAS_LIMIT = 700_000n;
export const SWAP_MAX_FEE_PER_GAS = 30_000_000_000n;
export const SWAP_MAX_PRIORITY_FEE_PER_GAS = 1_000_000_000n;

// exactOutputSingle returns amountIn (uint256); the MPC re-packs it as uint64 for the
// attestation. Two schemas — must byte-match the contract's swapOutputSchema / swapRespondSchema.
export const SWAP_OUTPUT_SCHEMA = '[{"name":"amountIn","type":"uint256"}]';
export const SWAP_RESPOND_SCHEMA = '[{"name":"amountIn","type":"uint64"}]';
export const SWAP_OUTPUT_SCHEMA_BYTES = SWAP_OUTPUT_SCHEMA.length;
export const SWAP_RESPOND_SCHEMA_BYTES = SWAP_RESPOND_SCHEMA.length;

// The contract-fixed routing of a swap event (the swap-schema variant of the vault routing).
export const SWAP_MPC_ROUTING = {
  algo: MPCSignatureAlgorithm.ecdsa,
  dest: MPCDestination.unused,
  params: new Uint8Array(MPC_PARAMS_BYTES),
  outputDeserializationSchema: asciiPadded(
    SWAP_OUTPUT_SCHEMA,
    SWAP_OUTPUT_SCHEMA_BYTES,
  ),
  respondSerializationSchema: asciiPadded(
    SWAP_RESPOND_SCHEMA,
    SWAP_RESPOND_SCHEMA_BYTES,
  ),
};

const QUOTER_ABI = [
  'function quoteExactOutputSingle((address tokenIn,address tokenOut,uint256 amount,uint24 fee,uint160 sqrtPriceLimitX96)) returns (uint256 amountIn,uint160 sqrtPriceX96After,uint32 initializedTicksCrossed,uint256 gasEstimate)',
  'function quoteExactInputSingle((address tokenIn,address tokenOut,uint256 amountIn,uint24 fee,uint160 sqrtPriceLimitX96)) returns (uint256 amountOut,uint160 sqrtPriceX96After,uint32 initializedTicksCrossed,uint256 gasEstimate)',
];

/** Whether the Uniswap router is deployed at `evmRpcUrl` (true on Sepolia + the fork). */
export async function uniswapAvailable(evmRpcUrl: string): Promise<boolean> {
  const code = await new JsonRpcProvider(evmRpcUrl).getCode(
    UNISWAP_SWAP_ROUTER_02,
  );
  return code !== '0x';
}

/**
 * Live QuoterV2 quote for exactOutputSingle (a read-only `eth_call`, no state change): the
 * `amountIn` needed to receive `amountOut`, plus the `amountInMaximum` after applying
 * `slippageBps` (headroom ABOVE the quote). This is what the UI shows and what the swap circuit
 * binds as the on-chain slippage cap.
 */
export async function quoteExactOutputSingle(
  evmRpcUrl: string,
  tokenIn: string,
  tokenOut: string,
  fee: bigint,
  amountOut: bigint,
  slippageBps = 100n, // 1%
): Promise<{ amountIn: bigint; amountInMaximum: bigint }> {
  const quoter = new EthersContract(
    UNISWAP_QUOTER_V2,
    QUOTER_ABI,
    new JsonRpcProvider(evmRpcUrl),
  );
  const [amountIn] = await quoter
    .getFunction('quoteExactOutputSingle')
    .staticCall({
      tokenIn,
      tokenOut,
      amount: amountOut,
      fee,
      sqrtPriceLimitX96: 0n,
    });
  const amountInMaximum =
    (BigInt(amountIn) * (10_000n + slippageBps)) / 10_000n;
  return { amountIn: BigInt(amountIn), amountInMaximum };
}

// The Uniswap V3 fee tiers, in bps*100 (0.01% / 0.05% / 0.3% / 1%). Different pairs live in
// different tiers (e.g. USDC/EURC is 0.05%, a USDC/DAI pool may only exist at 0.01% or 0.3%),
// so the UI must discover which tier actually has a pool rather than assume one.
export const UNISWAP_FEE_TIERS = [100n, 500n, 3000n, 10000n];

/**
 * Quote across every fee tier for a desired `amountOut` and return the CHEAPEST (lowest
 * amountIn; a tier with no pool reverts, so it's skipped). Returns the winning tier's `fee` so
 * the swap binds the SAME pool the quote used. `null` means no pool for this pair at any tier.
 */
export async function quoteBestFee(
  evmRpcUrl: string,
  tokenIn: string,
  tokenOut: string,
  amountOut: bigint,
  slippageBps = 100n,
): Promise<{ amountIn: bigint; amountInMaximum: bigint; fee: bigint } | null> {
  const results = await Promise.allSettled(
    UNISWAP_FEE_TIERS.map(async fee => ({
      fee,
      ...(await quoteExactOutputSingle(
        evmRpcUrl,
        tokenIn,
        tokenOut,
        fee,
        amountOut,
        slippageBps,
      )),
    })),
  );
  let best: { amountIn: bigint; amountInMaximum: bigint; fee: bigint } | null =
    null;
  for (const r of results) {
    if (
      r.status === 'fulfilled' &&
      r.value.amountIn > 0n &&
      (!best || r.value.amountIn < best.amountIn)
    ) {
      best = {
        amountIn: r.value.amountIn,
        amountInMaximum: r.value.amountInMaximum,
        fee: r.value.fee,
      };
    }
  }
  return best;
}

/**
 * Live QuoterV2 quote for exactInputSingle (read-only `eth_call`): the `amountOut` a swap of
 * `amountIn` would yield at `fee`. Drives the normal swap UX — the user types the spend, we show
 * the expected receive — while the on-chain swap stays exactOutput (see `quoteBestFeeExactInput`).
 */
export async function quoteExactInputSingle(
  evmRpcUrl: string,
  tokenIn: string,
  tokenOut: string,
  fee: bigint,
  amountIn: bigint,
): Promise<{ amountOut: bigint }> {
  const quoter = new EthersContract(
    UNISWAP_QUOTER_V2,
    QUOTER_ABI,
    new JsonRpcProvider(evmRpcUrl),
  );
  const [amountOut] = await quoter
    .getFunction('quoteExactInputSingle')
    .staticCall({
      tokenIn,
      tokenOut,
      amountIn,
      fee,
      sqrtPriceLimitX96: 0n,
    });
  return { amountOut: BigInt(amountOut) };
}

/**
 * Quote a desired `amountIn` (the spend) across every fee tier and return the tier giving the
 * BEST (highest) `amountOut` — the pool the swap should use. `null` means no pool for this pair at
 * any tier. The caller applies slippage to `amountOut` to derive the exactOutput target.
 */
export async function quoteBestFeeExactInput(
  evmRpcUrl: string,
  tokenIn: string,
  tokenOut: string,
  amountIn: bigint,
): Promise<{ amountOut: bigint; fee: bigint } | null> {
  const results = await Promise.allSettled(
    UNISWAP_FEE_TIERS.map(async fee => ({
      fee,
      ...(await quoteExactInputSingle(evmRpcUrl, tokenIn, tokenOut, fee, amountIn)),
    })),
  );
  let best: { amountOut: bigint; fee: bigint } | null = null;
  for (const r of results) {
    if (
      r.status === 'fulfilled' &&
      r.value.amountOut > 0n &&
      (!best || r.value.amountOut > best.amountOut)
    ) {
      best = { amountOut: r.value.amountOut, fee: r.value.fee };
    }
  }
  return best;
}

// A normalized, order-independent key for a token pair (both lowercased + sorted).
export function pairKey(tokenA: string, tokenB: string): string {
  return [tokenA.toLowerCase(), tokenB.toLowerCase()].sort().join('|');
}

const FACTORY_ABI = [
  'function getPool(address,address,uint24) view returns (address)',
];
const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

/**
 * Which of the given token pairs have a direct V3 pool at any fee tier. Returns a set of
 * `pairKey`s so the UI can offer only swappable pairs (a token with no pool to anything is
 * hidden entirely). One factory `getPool` per (pair, tier) — cheap read-only `eth_call`s.
 */
export async function discoverSwappablePairs(
  evmRpcUrl: string,
  tokens: string[],
): Promise<Set<string>> {
  const factory = new EthersContract(
    UNISWAP_V3_FACTORY,
    FACTORY_ABI,
    new JsonRpcProvider(evmRpcUrl),
  );
  const getPool = factory.getFunction('getPool');
  const swappable = new Set<string>();
  const checks: Promise<void>[] = [];
  for (let i = 0; i < tokens.length; i++) {
    for (let j = i + 1; j < tokens.length; j++) {
      const a = tokens[i]!;
      const b = tokens[j]!;
      for (const fee of UNISWAP_FEE_TIERS) {
        checks.push(
          getPool(a, b, fee)
            .then((pool: string) => {
              if (pool && pool !== ZERO_ADDRESS) swappable.add(pairKey(a, b));
            })
            .catch(() => {}),
        );
      }
    }
  }
  await Promise.all(checks);
  return swappable;
}

/** The live vault->router allowance for a token (0 means approveRouter is needed once). */
export async function routerAllowance(
  evmRpcUrl: string,
  erc20Hex: string,
  vaultEvmAddress: string,
): Promise<bigint> {
  const token = new EthersContract(
    erc20Hex,
    ['function allowance(address,address) view returns (uint256)'],
    new JsonRpcProvider(evmRpcUrl),
  );
  return BigInt(
    await token.getFunction('allowance')(
      vaultEvmAddress,
      UNISWAP_SWAP_ROUTER_02,
    ),
  );
}
