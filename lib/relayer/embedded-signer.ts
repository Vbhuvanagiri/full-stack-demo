import { ChainSignatureServer } from 'fakenet-signer';

import { getFullEnv } from '@/lib/config/env.config';

const SERVER_READY_DELAY_MS = 2000;

let activeServer: ChainSignatureServer | null = null;

export async function startEmbeddedSigner(): Promise<ChainSignatureServer | null> {
  const env = getFullEnv();

  if (!env.MPC_ROOT_KEY) {
    console.log('[EmbeddedSigner] MPC_ROOT_KEY not set, using external signer');
    return null;
  }

  if (activeServer) {
    console.log('[EmbeddedSigner] Server already running, reusing instance');
    return activeServer;
  }

  const solanaRpcUrl = process.env.NEXT_PUBLIC_HELIUS_RPC_URL;
  if (!solanaRpcUrl) {
    throw new Error('[EmbeddedSigner] NEXT_PUBLIC_HELIUS_RPC_URL environment variable is required for embedded signer mode');
  }

  console.log('[EmbeddedSigner] Starting embedded ChainSignatureServer...');

  const server = new ChainSignatureServer({
    solanaRpcUrl,
    solanaPrivateKey: env.RELAYER_PRIVATE_KEY,
    mpcRootKey: env.MPC_ROOT_KEY,
    infuraApiKey: env.INFURA_API_KEY,
    programId: env.NEXT_PUBLIC_CHAIN_SIGNATURES_PROGRAM_ID,
    isDevnet: true,
    verbose: false,
    bitcoinNetwork: 'testnet',
  });

  await server.start();
  await new Promise(resolve => setTimeout(resolve, SERVER_READY_DELAY_MS));

  activeServer = server;
  console.log('[EmbeddedSigner] Server ready');

  return server;
}

export async function stopEmbeddedSigner(): Promise<void> {
  if (!activeServer) {
    return;
  }

  console.log('[EmbeddedSigner] Shutting down...');

  try {
    await activeServer.shutdown();
  } catch (error) {
    console.error('[EmbeddedSigner] Shutdown error:', error);
  } finally {
    activeServer = null;
  }
}

export async function withEmbeddedSigner<T>(
  fn: () => Promise<T>,
): Promise<T> {
  const server = await startEmbeddedSigner();

  try {
    return await fn();
  } finally {
    if (server) {
      await stopEmbeddedSigner();
    }
  }
}
