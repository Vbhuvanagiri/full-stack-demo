// Core token interface with balance - decimals required (fetched from chain)
export interface Token {
  erc20Address: string;
  symbol: string;
  name: string;
  decimals: number;
  chain: 'ethereum' | 'solana' | 'midnight';
}

// Token balance with string amount (for service/API data)
export interface TokenBalance extends Token {
  amount: string;
}

// Token with bigint balance (for UI components)
export interface TokenWithBalance extends Token {
  balance: bigint;
  balanceUsd?: string;
}

// Token formatting information (for utilities only)
export interface TokenFormatInfo {
  symbol: string;
  decimals: number;
  name: string;
  displaySymbol: string; // Normalized symbol for icon display
}
