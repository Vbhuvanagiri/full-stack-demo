'use client';

import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-client';

import { useDexContract } from './use-dex-contract';
import { useSolanaPublicKey } from './use-solana-public-key';

export function useDepositAddress() {
  const dexContract = useDexContract();
  const publicKey = useSolanaPublicKey();

  return useQuery({
    queryKey: publicKey
      ? queryKeys.solana.depositAddress(publicKey.toString())
      : [],
    queryFn: () => {
      if (!publicKey || !dexContract)
        throw new Error('No public key or dex contract available');
      return dexContract.deriveDepositAddress(publicKey);
    },
    enabled: !!publicKey && !!dexContract,
  });
}
