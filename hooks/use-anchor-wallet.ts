'use client';

import { useWallet, useTransactionSigner } from '@solana/connector/react';
import { PublicKey, Transaction, VersionedTransaction } from '@solana/web3.js';
import type { Wallet } from '@coral-xyz/anchor';

export function useAnchorWallet(): Wallet | null {
  const { isConnected } = useWallet();
  const { signer, ready } = useTransactionSigner();

  if (!isConnected || !ready || !signer) {
    return null;
  }

  const publicKey = new PublicKey(signer.address);

  return {
    publicKey,
    signTransaction: async <T extends Transaction | VersionedTransaction>(
      tx: T,
    ): Promise<T> => {
      const signed = await signer.signTransaction(tx);
      return signed as T;
    },
    signAllTransactions: async <T extends Transaction | VersionedTransaction>(
      txs: T[],
    ): Promise<T[]> => {
      const signed = await signer.signAllTransactions(txs);
      return signed as T[];
    },
  } as Wallet;
}
