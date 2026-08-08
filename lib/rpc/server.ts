import { Connection } from '@solana/web3.js';

import { CONNECTION_CONFIG, getRpcEndpoint } from '@/lib/config/connection.config';

export function getServerConnection(): Connection {
  return new Connection(getRpcEndpoint('client'), CONNECTION_CONFIG);
}

export function getRelayerConnection(): Connection {
  return new Connection(getRpcEndpoint('relayer'), CONNECTION_CONFIG);
}
