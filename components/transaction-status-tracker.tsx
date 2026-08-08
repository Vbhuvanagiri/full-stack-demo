'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
  usePendingTransactions,
  type PendingTransaction,
} from '@/providers/pending-transactions-context';
import { useTxStatus, getStatusLabel } from '@/hooks';

function TransactionToast({ tx }: { tx: PendingTransaction }) {
  const { data: status, refetch } = useTxStatus(tx.id);
  const { removePendingTransaction } = usePendingTransactions();
  const previousStatusRef = useRef<string | null>(null);

  useEffect(() => {
    if (!status) return;

    const currentStatus = status.status;
    const previousStatus = previousStatusRef.current;

    // Only show toast if status changed
    if (previousStatus !== currentStatus) {
      previousStatusRef.current = currentStatus;

      const label = getStatusLabel(currentStatus);
      const txType = tx.type === 'deposit' ? 'Deposit' : 'Withdrawal';

      // Remove from pending context when on-chain data exists to avoid duplicates
      // For deposits: solana_pending means Solana tx landed, appears in incomingTransfers
      // For withdrawals: signature_pending means processing started
      const hasOnChainData =
        currentStatus === 'solana_pending' ||
        currentStatus === 'signature_pending' ||
        currentStatus === 'ethereum_pending' ||
        currentStatus === 'completing' ||
        currentStatus === 'completed';

      if (hasOnChainData) {
        removePendingTransaction(tx.id);
      }

      if (currentStatus === 'completed') {
        toast.success(`${txType} completed!`, {
          description: status.ethereumTxHash
            ? `ETH Tx: ${status.ethereumTxHash.slice(0, 10)}...`
            : undefined,
        });
      } else if (currentStatus === 'failed') {
        toast.error(`${txType} failed`, {
          description: status.error || 'Unknown error',
        });
        removePendingTransaction(tx.id);
      } else if (previousStatus && previousStatus !== 'pending') {
        // Show progress update for non-initial states
        toast.info(`${txType}: ${label}`, {
          id: `tx-progress-${tx.id}`,
        });
      }
    }
  }, [status, tx, removePendingTransaction, refetch]);

  return null;
}

export function TransactionStatusTracker() {
  const { pendingTransactions } = usePendingTransactions();

  return (
    <>
      {pendingTransactions.map(tx => (
        <TransactionToast key={tx.id} tx={tx} />
      ))}
    </>
  );
}
