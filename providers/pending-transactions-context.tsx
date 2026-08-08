'use client';

import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from 'react';

export interface PendingTransaction {
  id: string;
  type: 'deposit' | 'withdrawal';
  erc20Address: string;
  userAddress: string;
  startedAt: number;
}

interface PendingTransactionsContextValue {
  pendingTransactions: PendingTransaction[];
  addPendingTransaction: (tx: PendingTransaction) => void;
  removePendingTransaction: (id: string) => void;
}

const PendingTransactionsContext =
  createContext<PendingTransactionsContextValue | null>(null);

export function PendingTransactionsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [pendingTransactions, setPendingTransactions] = useState<
    PendingTransaction[]
  >([]);

  const addPendingTransaction = (tx: PendingTransaction) => {
    setPendingTransactions(prev => {
      // Don't add duplicates
      if (prev.some(p => p.id === tx.id)) return prev;
      return [...prev, tx];
    });
  };

  const removePendingTransaction = (id: string) => {
    setPendingTransactions(prev => prev.filter(tx => tx.id !== id));
  };

  return (
    <PendingTransactionsContext.Provider
      value={{
        pendingTransactions,
        addPendingTransaction,
        removePendingTransaction,
      }}
    >
      {children}
    </PendingTransactionsContext.Provider>
  );
}

export function usePendingTransactions() {
  const context = useContext(PendingTransactionsContext);
  if (!context) {
    throw new Error(
      'usePendingTransactions must be used within PendingTransactionsProvider',
    );
  }
  return context;
}
