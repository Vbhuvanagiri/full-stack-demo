'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/connector/react';
import { toast } from 'sonner';

import { queryKeys, invalidateBalanceQueries } from '@/lib/query-client';
import { WithdrawalService } from '@/lib/services/withdrawal-service';
import type { StatusCallback } from '@/lib/types/shared.types';
import { usePendingTransactions } from '@/providers/pending-transactions-context';

import { useDexContract } from './use-dex-contract';
import { useSolanaPublicKey } from './use-solana-public-key';

export function useWithdrawEvmMutation() {
  const { account } = useWallet();
  const dexContract = useDexContract();
  const withdrawalService = dexContract ? new WithdrawalService(dexContract) : null;
  const queryClient = useQueryClient();
  const publicKey = useSolanaPublicKey();
  const { addPendingTransaction } = usePendingTransactions();

  return useMutation({
    mutationFn: async ({
      erc20Address,
      amount,
      recipientAddress,
      onStatusChange,
    }: {
      erc20Address: string;
      amount: string;
      recipientAddress: string;
      onStatusChange?: StatusCallback;
    }) => {
      if (!publicKey) throw new Error('No public key available');
      if (!withdrawalService)
        throw new Error('Withdrawal service not available');
      return withdrawalService.withdrawEvm(
        publicKey,
        erc20Address,
        amount,
        recipientAddress,
        onStatusChange,
      );
    },
    onSuccess: (requestId, variables) => {
      // Add to pending transactions for tracking
      if (account) {
        addPendingTransaction({
          id: requestId,
          type: 'withdrawal',
          erc20Address: variables.erc20Address,
          userAddress: account,
          startedAt: Date.now(),
        });

        toast.info('Withdrawal initiated', {
          description: 'Processing your withdrawal...',
        });

        invalidateBalanceQueries(queryClient, account);
        queryClient.invalidateQueries({
          queryKey: queryKeys.solana.txList(account),
        });
      }
    },
    onError: (error, variables) => {
      console.error('Withdraw EVM mutation failed:', error);
      if (variables.onStatusChange) {
        variables.onStatusChange({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Withdrawal failed',
        });
      }

      toast.error('Withdrawal failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
