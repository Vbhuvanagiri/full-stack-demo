import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { formatUnits } from 'viem';

import { TokenBalance, TokenWithBalance } from './types/token.types';
import { SERVICE_CONFIG } from './constants/service.config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function convertTokenBalancesToDisplayTokens(
  tokenBalances: TokenBalance[],
): TokenWithBalance[] {
  return tokenBalances
    .map(tokenBalance => ({
      erc20Address: tokenBalance.erc20Address,
      symbol: tokenBalance.symbol,
      name: tokenBalance.name,
      decimals: tokenBalance.decimals,
      chain: tokenBalance.chain,
      balance: BigInt(tokenBalance.amount),
    }))
    .filter(token => {
      const numericBalance = parseFloat(
        formatUnits(token.balance, token.decimals),
      );
      return numericBalance >= SERVICE_CONFIG.BALANCE.MINIMUM_BALANCE;
    });
}
