import { Connection, Keypair } from '@solana/web3.js';
import NodeWallet from '@coral-xyz/anchor/dist/esm/nodewallet.js';
import type { PublicClient, Hex } from 'viem';
import { privateKeyToAccount, type PrivateKeyAccount } from 'viem/accounts';

import {
  CrossChainOrchestrator,
  type CrossChainConfig,
} from '@/lib/services/cross-chain-orchestrator';
import { getEthereumProvider } from '@/lib/rpc';
import { getRelayerConnection } from '@/lib/rpc/server';
import { getFullEnv } from '@/lib/config/env.config';

let cachedKeypair: Keypair | null = null;
let cachedNodeWallet: NodeWallet | null = null;
let cachedEthAccount: PrivateKeyAccount | null = null;

function parseRelayerPrivateKey(): Uint8Array {
  const env = getFullEnv();
  return new Uint8Array(JSON.parse(env.RELAYER_PRIVATE_KEY));
}

export function getRelayerSolanaKeypair(): Keypair {
  if (cachedKeypair) return cachedKeypair;

  cachedKeypair = Keypair.fromSecretKey(parseRelayerPrivateKey());
  return cachedKeypair;
}

export function getRelayerSolanaWallet(): NodeWallet {
  if (cachedNodeWallet) return cachedNodeWallet;

  cachedNodeWallet = new NodeWallet(getRelayerSolanaKeypair());
  return cachedNodeWallet;
}

export function getRelayerEthAccount(): PrivateKeyAccount {
  if (cachedEthAccount) return cachedEthAccount;

  const keypairBytes = parseRelayerPrivateKey();
  const ethPrivateKey =
    `0x${Buffer.from(keypairBytes.slice(0, 32)).toString('hex')}` as Hex;
  cachedEthAccount = privateKeyToAccount(ethPrivateKey);
  return cachedEthAccount;
}

export interface RelayerSetup {
  connection: Connection;
  provider: PublicClient;
  relayerWallet: NodeWallet;
  orchestrator: CrossChainOrchestrator;
}

export async function initializeRelayerSetup(
  config: CrossChainConfig = {},
): Promise<RelayerSetup> {
  const connection = getRelayerConnection();

  const provider = getEthereumProvider();

  const relayerWallet = getRelayerSolanaWallet();

  const orchestrator = new CrossChainOrchestrator(
    connection,
    relayerWallet,
    provider,
    config,
    connection,
  );

  return {
    connection,
    provider,
    relayerWallet,
    orchestrator,
  };
}
