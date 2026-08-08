'use client';

import { usePendingTransactions } from '@/providers/pending-transactions-context';
import { useTxList } from './use-tx-list';

export function useHasActiveTransaction(): boolean {
  const { pendingTransactions } = usePendingTransactions();
  const { data: txList } = useTxList();

  // In-memory pending transactions are always considered active
  if (pendingTransactions.length > 0) return true;

  // Check Redis-backed tx list for any non-terminal transaction
  if (txList?.some(tx => tx.status !== 'completed' && tx.status !== 'failed')) {
    return true;
  }

  return false;
}
