import { erc20Abi, type Hex } from 'viem';

import { getEthereumProvider } from '@/lib/rpc';

// Token display info - decimals come from on-chain fetching
export interface TokenConfig {
  erc20Address: string;
  symbol: string;
  name: string;
  chain: 'ethereum' | 'solana' | 'midnight';
  /** How to acquire this token on testnet */
  acquireHint?: string;
  /** Direct URL to get this token (faucet, swap page, etc.) */
  faucetUrl?: string;
}

// ERC20 tokens on Sepolia
export const ERC20_TOKENS: TokenConfig[] = [
  {
    erc20Address: '0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238',
    symbol: 'USDC',
    name: 'USD Coin',
    chain: 'ethereum',
    acquireHint: 'Get testnet USDC from the Circle faucet.',
    faucetUrl: 'https://faucet.circle.com/',
  },
  {
    erc20Address: '0x08210F9170F89Ab7658F0B5E3fF39b0E03C594D4',
    symbol: 'EURC',
    name: 'Euro Coin',
    chain: 'ethereum',
    acquireHint: 'Get testnet EURC from the Circle faucet.',
    faucetUrl: 'https://faucet.circle.com/',
  },
  {
    erc20Address: '0xB4F1737Af37711e9A5890D9510c9bB60e170CB0D',
    symbol: 'DAI',
    name: 'Dai',
    chain: 'ethereum',
    acquireHint:
      'Swap Sepolia ETH for DAI on CoW Swap. First get Sepolia ETH from a faucet, then swap.',
    faucetUrl:
      'https://swap.cow.fi/#/11155111/swap/ETH/0xB4F1737Af37711e9A5890D9510c9bB60e170CB0D',
  },
  {
    erc20Address: '0x0625aFB445C3B6B7B929342a04A22599fd5dBB59',
    symbol: 'COW',
    name: 'CoW Protocol',
    chain: 'ethereum',
    acquireHint:
      'Swap Sepolia ETH for COW on CoW Swap. First get Sepolia ETH from a faucet, then swap.',
    faucetUrl:
      'https://swap.cow.fi/#/11155111/swap/ETH/0x0625aFB445C3B6B7B929342a04A22599fd5dBB59',
  },
];

// Solana tokens
export const SOLANA_TOKENS: TokenConfig[] = [
  {
    erc20Address: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
    symbol: 'USDC',
    name: 'USD Coin',
    chain: 'solana',
    acquireHint: 'Get devnet USDC from the Circle faucet.',
    faucetUrl: 'https://faucet.circle.com/',
  },
  {
    erc20Address: 'HzwqbKZw8HxMN6bF2yFZNrht3c2iXXzpKcFu7uBEDKtr',
    symbol: 'EURC',
    name: 'Euro Coin',
    chain: 'solana',
    acquireHint: 'Get devnet EURC from the Circle faucet.',
    faucetUrl: 'https://faucet.circle.com/',
  },
];

// Midnight (Lace) — the vault supports any ERC-20 (deposit/withdraw take the token
// address), so expose the same Sepolia tokens as the Ethereum side, as shielded tokens.
export const MIDNIGHT_TOKENS: TokenConfig[] = ERC20_TOKENS.map(t => ({
  ...t,
  chain: 'midnight' as const,
}));

export interface NetworkData {
  chain: 'ethereum' | 'solana' | 'midnight';
  chainName: string;
  symbol: string;
  tokens: TokenConfig[];
}

export const NETWORKS_WITH_TOKENS: NetworkData[] = [
  {
    chain: 'ethereum',
    chainName: 'Ethereum',
    symbol: 'ethereum',
    tokens: ERC20_TOKENS,
  },
  {
    chain: 'solana',
    chainName: 'Solana',
    symbol: 'solana',
    tokens: SOLANA_TOKENS,
  },
  {
    chain: 'midnight',
    chainName: 'Midnight',
    symbol: 'midnight',
    tokens: MIDNIGHT_TOKENS,
  },
];

// ERC20 functions
const ERC20_ALLOWLIST_SET = new Set(
  ERC20_TOKENS.map(t => t.erc20Address.toLowerCase()),
);

export function isErc20Allowed(address: string): boolean {
  return ERC20_ALLOWLIST_SET.has(address.toLowerCase());
}

const ERC20_TOKEN_MAP = new Map<string, TokenConfig>(
  ERC20_TOKENS.map(token => [token.erc20Address.toLowerCase(), token]),
);

export function getErc20Token(address: string): TokenConfig | undefined {
  return ERC20_TOKEN_MAP.get(address.toLowerCase());
}

// In-memory cache for token decimals (immutable, never expires)
const decimalsCache = new Map<string, number>();

// Fetch ERC20 decimals from chain
export async function fetchErc20Decimals(address: string): Promise<number> {
  if (!isErc20Allowed(address)) {
    throw new Error(`Token not supported: ${address}`);
  }

  const normalizedAddress = address.toLowerCase();

  const cached = decimalsCache.get(normalizedAddress);
  if (cached !== undefined) {
    return cached;
  }

  const client = getEthereumProvider();
  const decimals = await client.readContract({
    address: address as Hex,
    abi: erc20Abi,
    functionName: 'decimals',
  });

  decimalsCache.set(normalizedAddress, decimals);

  return decimals;
}
