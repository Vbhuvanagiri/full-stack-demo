'use client';

import { useEffect, useState } from 'react';

import {
  midnightTxHistory,
  type MidnightTxRecord,
} from '@/lib/midnight/tx-history';
import { formatActivityDate } from '@/lib/utils/date-formatting';
import type { ActivityTransaction } from '@/components/activity-list-table';

const CHAIN = 'midnight';

// A refund returns the funds but the intended op did not execute, so it reads as a failure in the
// badge (the details still say "refunded" via the log/toast).
function toStatus(s: MidnightTxRecord['status']): ActivityTransaction['status'] {
  if (s === 'completed') return 'completed';
  if (s === 'pending') return 'pending';
  return 'failed';
}

function toActivity(r: MidnightTxRecord): ActivityTransaction {
  // Match the Redis builder's WALLET convention: deposit's source and withdraw's destination are
  // the wallet/address side; the other side is the token amount.
  const fromToken =
    r.type === 'Deposit'
      ? { symbol: 'WALLET', chain: CHAIN, amount: r.fromAmount, usdValue: '' }
      : { symbol: r.fromSymbol, chain: CHAIN, amount: r.fromAmount, usdValue: '' };
  const toToken =
    r.type === 'Withdraw'
      ? { symbol: 'WALLET', chain: CHAIN, amount: r.toAmount, usdValue: '' }
      : {
          symbol: r.toSymbol,
          chain: CHAIN,
          amount: r.toAmount || r.toSymbol,
          usdValue: '',
        };
  return {
    id: r.id,
    type: r.type,
    fromToken,
    toToken,
    address: r.counterparty,
    timestamp: formatActivityDate(r.timestampRaw),
    timestampRaw: r.timestampRaw,
    status: toStatus(r.status),
    transactionHash: r.txHash,
    explorerUrl: r.txHash
      ? `https://sepolia.etherscan.io/tx/${r.txHash}`
      : undefined,
  };
}

/** Live Midnight vault operations mapped to the Activity table's row shape. */
export function useMidnightTransactions(): ActivityTransaction[] {
  const [txs, setTxs] = useState<MidnightTxRecord[]>([]);
  useEffect(() => midnightTxHistory.subscribe(setTxs), []);
  return txs.map(toActivity);
}
