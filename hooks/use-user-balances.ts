'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';
import { TokenBalanceService } from '@/lib/services/token-balance-service';

import { useDexContract } from './use-dex-contract';
import { useSolanaPublicKey } from './use-solana-public-key';

export function useUserBalances() {
  const dexContract = useDexContract();
  const publicKey = useSolanaPublicKey();
  const tokenBalanceService = dexContract
    ? new TokenBalanceService(dexContract)
    : null;

  return useQuery({
    queryKey: publicKey
      ? queryKeys.solana.userBalances(publicKey.toString())
      : [],
    queryFn: () => {
      if (!publicKey) throw new Error('No public key available');
      if (!tokenBalanceService)
        throw new Error('Token balance service not available');
      return tokenBalanceService.fetchUserBalances(publicKey);
    },
    enabled: !!publicKey && !!tokenBalanceService,
    staleTime: 15 * 1000,
    refetchInterval: 15 * 1000,
    refetchIntervalInBackground: false,
  });
}
