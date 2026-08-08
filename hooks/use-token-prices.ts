'use client';

import { useQuery } from '@tanstack/react-query';

// CoinGecko API for token prices
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

// Token symbol to CoinGecko ID mapping
const TOKEN_ID_MAP: Record<string, string> = {
  USDC: 'usd-coin',
  ETH: 'ethereum',
  SOL: 'solana',
  BTC: 'bitcoin',
  DAI: 'dai',
  COW: 'cow-protocol',
};

export interface TokenPrice {
  symbol: string;
  usd: number;
  change24h?: number;
}

async function fetchTokenPrices(
  symbols: string[],
): Promise<Record<string, TokenPrice>> {
  if (symbols.length === 0) return {};

  const coinIds = symbols
    .map(symbol => TOKEN_ID_MAP[symbol.toUpperCase()])
    .filter(Boolean);

  if (coinIds.length === 0) return {};

  const response = await fetch(
    `${COINGECKO_API}/simple/price?ids=${coinIds.join(',')}&vs_currencies=usd&include_24hr_change=true`,
  );

  if (!response.ok) {
    throw new Error('Failed to fetch token prices');
  }

  const data = await response.json();

  const prices: Record<string, TokenPrice> = {};

  Object.entries(TOKEN_ID_MAP).forEach(([symbol, coinId]) => {
    if (data[coinId]) {
      prices[symbol] = {
        symbol,
        usd: data[coinId].usd,
        change24h: data[coinId].usd_24h_change,
      };
    }
  });

  return prices;
}

export function useTokenPrices(symbols: string[] = []) {
  return useQuery({
    queryKey: ['tokenPrices', symbols.sort()],
    queryFn: () => fetchTokenPrices(symbols),
    staleTime: 120000,
    refetchInterval: 300000,
    refetchIntervalInBackground: false,
    enabled: symbols.length > 0,
  });
}

export function useTokenPrice(symbol: string) {
  const { data: prices, ...rest } = useTokenPrices([symbol]);

  return {
    ...rest,
    data: prices?.[symbol.toUpperCase()],
  };
}
