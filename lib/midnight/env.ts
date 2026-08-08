import type { Env } from './vault';

// The client polls the signet contract's response logs + the fakenet /responses API,
// and broadcasts the MPC-signed EVM tx to Sepolia itself.
export const midnightEnv: Env = {
  contractAddress: process.env.NEXT_PUBLIC_MIDNIGHT_CONTRACT_ADDRESS ?? '',
  signetContractAddress: process.env.NEXT_PUBLIC_MIDNIGHT_SIGNET_CONTRACT_ADDRESS ?? '',
  mpcSecpPub: process.env.NEXT_PUBLIC_MPC_SECP256K1_PUBKEY ?? '',
  evmRpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL ?? '',
  fakenetResponsesUrl:
    process.env.NEXT_PUBLIC_FAKENET_RESPONSES_URL ?? 'http://localhost:3040',
};

export const midnightNetworkId =
  process.env.NEXT_PUBLIC_MIDNIGHT_NETWORK_ID ?? 'undeployed';
