'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import type { TxEntry } from '@/lib/relayer/tx-registry';

import { useSolanaPublicKey } from './use-solana-public-key';

export function useTxList() {
  const publicKey = useSolanaPublicKey();
  const userAddress = publicKey?.toBase58() ?? null;

  return useQuery({
    queryKey: userAddress ? queryKeys.solana.txList(userAddress) : [],
    queryFn: async (): Promise<TxEntry[]> => {
      if (!userAddress) return [];

      const res = await fetch(`/api/tx-list?userAddress=${userAddress}`);
      if (!res.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return res.json();
    },
    enabled: !!userAddress,
    staleTime: 10000,
    refetchInterval: 10000,
    refetchIntervalInBackground: false,
  });
}
