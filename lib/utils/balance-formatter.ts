import { formatUnits } from 'viem';

export interface FormatBalanceOptions {
  /** Manual precision override (decimal places to show) */
  precision?: number;
  /** Include token symbol in output */
  showSymbol?: boolean;
  /** Show USD value instead of token amount */
  showUsd?: boolean;
  /** USD price per token for conversion */
  usdPrice?: number;
}

/**
 * Calculate smart precision based on amount size
 */
function calculateSmartPrecision(
  numericAmount: number,
  maxDecimals: number,
): number {
  if (numericAmount >= 1000) {
    return Math.min(2, maxDecimals);
  } else if (numericAmount >= 1) {
    return Math.min(4, maxDecimals);
  } else if (numericAmount >= 0.01) {
    return Math.min(6, maxDecimals);
  } else if (numericAmount > 0) {
    return Math.min(8, maxDecimals);
  }
  return 2; // For zero amounts
}

/**
 * Core formatting logic (used by both sync and async versions)
 */
function formatBalanceCore(
  amount: bigint | string,
  decimals: number,
  symbol: string | undefined,
  options: FormatBalanceOptions = {},
): string {
  const { precision, showSymbol = false, showUsd = false, usdPrice } = options;

  // Convert amount to bigint if needed
  const amountBigInt = typeof amount === 'string' ? BigInt(amount) : amount;

  // Convert to decimal using viem's formatUnits for consistency
  const formattedAmount = formatUnits(amountBigInt, decimals);
  const numericAmount = parseFloat(formattedAmount);

  // Handle USD conversion
  if (showUsd && typeof usdPrice === 'number') {
    const usdValue = numericAmount * usdPrice;
    if (usdValue === 0) return '$0.00';
    if (usdValue < 0.01) return '<$0.01';

    return `$${usdValue.toFixed(2)}`;
  }

  // Calculate precision
  const actualPrecision =
    precision !== undefined
      ? Math.min(precision, decimals)
      : calculateSmartPrecision(numericAmount, decimals);

  // Format the number using toFixed and remove trailing zeros
  let result = numericAmount.toFixed(actualPrecision).replace(/\.?0+$/, '');

  // Add thousand separators for large whole numbers
  if (!result.includes('.') && numericAmount >= 1000) {
    result = parseInt(result).toLocaleString();
  }

  // Add symbol if requested
  if (showSymbol && symbol) {
    result = `${result} ${symbol}`;
  }

  return result;
}

/**
 * Format token balance synchronously when decimals are already known
 * Use this when you already have the token decimals to avoid async calls
 *
 * @param amount - Raw token amount (bigint or string)
 * @param decimals - Number of decimal places for the token
 * @param symbol - Optional token symbol
 * @param options - Formatting options
 * @returns string - Formatted balance string
 *
 * @example
 * // Basic usage with known decimals
 * const formatted = formatTokenBalanceSync(amount, 6);
 *
 * // With symbol and compact format
 * const compact = formatTokenBalanceSync(amount, 6, 'USDC', {
 *   showSymbol: true,
 *   compact: true
 * });
 */
export function formatTokenBalanceSync(
  amount: bigint | string,
  decimals: number,
  symbol?: string,
  options: FormatBalanceOptions = {},
): string {
  return formatBalanceCore(amount, decimals, symbol, options);
}
