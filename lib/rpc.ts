import { Alchemy, Network } from 'alchemy-sdk';
import { createPublicClient, http, type PublicClient } from 'viem';
import { sepolia } from 'viem/chains';

import { getClientEnv } from '@/lib/config/env.config';

// Re-export Solana connection utilities from centralized config
export {
  getAlchemySolanaDevnetRpcUrl,
  getRpcEndpoint,
  CONNECTION_CONFIG,
} from '@/lib/config/connection.config';

let cachedEthereumProvider: PublicClient | null = null;

export function getEthereumProvider(): PublicClient {
  if (cachedEthereumProvider) {
    return cachedEthereumProvider;
  }
  cachedEthereumProvider = createPublicClient({
    chain: sepolia,
    transport: http(getEthSepoliaRpcUrl()),
  });
  return cachedEthereumProvider;
}

let cachedAlchemyProvider: Alchemy | null = null;

export function getAlchemyProvider(): Alchemy {
  if (cachedAlchemyProvider) {
    return cachedAlchemyProvider;
  }
  const env = getClientEnv();
  cachedAlchemyProvider = new Alchemy({
    apiKey: env.NEXT_PUBLIC_ALCHEMY_API_KEY,
    network: Network.ETH_SEPOLIA,
  });
  return cachedAlchemyProvider;
}

// The single Sepolia JSON-RPC endpoint (any provider) used by all EVM paths.
export function getEthSepoliaRpcUrl(): string {
  return getClientEnv().NEXT_PUBLIC_SEPOLIA_RPC_URL;
}
