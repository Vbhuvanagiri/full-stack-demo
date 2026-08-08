import { getClientEnv } from '@/lib/config/env.config';

/**
 * Centralized Solana connection configuration
 */
export const CONNECTION_CONFIG = {
  commitment: 'confirmed',
  disableRetryOnRateLimit: true,
  confirmTransactionInitialTimeout: 30000,
} as const;

const ALCHEMY_SOLANA_DEVNET_BASE_URL = 'https://solana-devnet.g.alchemy.com/v2';

/**
 * Builds the Alchemy Solana devnet RPC URL
 */
export function getAlchemySolanaDevnetRpcUrl(): string {
  const env = getClientEnv();
  return `${ALCHEMY_SOLANA_DEVNET_BASE_URL}/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
}

/**
 * Returns the appropriate RPC endpoint based on the layer
 *
 * @param layer - The layer requesting the RPC endpoint:
 *   - 'relayer': Returns Helius URL if available, otherwise falls back to Alchemy
 *   - 'client': Returns Alchemy Solana devnet URL (used by React components and hooks)
 */
export function getRpcEndpoint(layer: 'client' | 'relayer'): string {
  const env = getClientEnv();

  if (layer === 'relayer' && env.NEXT_PUBLIC_HELIUS_RPC_URL) {
    return env.NEXT_PUBLIC_HELIUS_RPC_URL;
  }

  return `${ALCHEMY_SOLANA_DEVNET_BASE_URL}/${env.NEXT_PUBLIC_ALCHEMY_API_KEY}`;
}
