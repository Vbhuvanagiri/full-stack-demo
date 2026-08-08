'use client';

import { PublicKey } from '@solana/web3.js';
import { useWallet } from '@solana/connector/react';

export function useSolanaPublicKey(): PublicKey | null {
  const { account, isConnected } = useWallet();
  return isConnected && account ? new PublicKey(account) : null;
}
