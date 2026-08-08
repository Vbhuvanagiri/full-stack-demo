'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWallet } from '@solana/connector/react';
import { toast } from 'sonner';

import {
  CHAIN_SIGNATURES_CONFIG,
  deriveEthereumAddress,
  deriveVaultAuthorityPda,
} from '@/lib/constants/addresses';
import { queryKeys, invalidateBalanceQueries } from '@/lib/query-client';
import { notifyDeposit } from '@/lib/services/relayer-service';
import type { StatusCallback } from '@/lib/types/shared.types';
import { usePendingTransactions } from '@/providers/pending-transactions-context';

import { useSolanaPublicKey } from './use-solana-public-key';

export interface DepositResult {
  derivedAddress: string;
  trackingId: string;
}

export function useDepositEvmMutation() {
  const { account } = useWallet();
  const queryClient = useQueryClient();
  const publicKey = useSolanaPublicKey();
  const { addPendingTransaction } = usePendingTransactions();

  return useMutation({
    mutationFn: async ({
      erc20Address,
      amount,
      decimals,
      tokenSymbol,
      onStatusChange,
    }: {
      erc20Address: string;
      amount: string;
      decimals: number;
      tokenSymbol?: string;
      onStatusChange?: StatusCallback;
    }): Promise<DepositResult> => {
      if (!publicKey) throw new Error('No public key available');

      const [vaultAuthority] = deriveVaultAuthorityPda(publicKey);
      const path = publicKey.toString();
      const derivedAddress = deriveEthereumAddress(
        path,
        vaultAuthority.toString(),
        CHAIN_SIGNATURES_CONFIG.MPC_ROOT_PUBLIC_KEY,
      );

      const response = await notifyDeposit({
        userAddress: publicKey.toString(),
        erc20Address,
        ethereumAddress: derivedAddress,
        tokenDecimals: decimals,
        tokenSymbol,
      });

      onStatusChange?.({
        status: 'relayer_processing',
        note: `Deposit ${amount} tokens to: ${derivedAddress}. Relayer will handle the bridge process.`,
      });

      return {
        derivedAddress,
        trackingId: response.trackingId,
      };
    },
    onSuccess: (result, variables) => {
      if (account) {
        addPendingTransaction({
          id: result.trackingId,
          type: 'deposit',
          erc20Address: variables.erc20Address,
          userAddress: account,
          startedAt: Date.now(),
        });

        toast.info('Deposit initiated', {
          description: 'Monitoring for your deposit...',
        });

        invalidateBalanceQueries(queryClient, account);
        queryClient.invalidateQueries({
          queryKey: queryKeys.solana.txList(account),
        });
      }
    },
    onError: (error, variables) => {
      console.error('Deposit EVM mutation failed:', error);
      if (variables.onStatusChange) {
        variables.onStatusChange({
          status: 'failed',
          error: error instanceof Error ? error.message : 'Deposit failed',
        });
      }

      toast.error('Deposit failed', {
        description: error instanceof Error ? error.message : 'Unknown error',
      });
    },
  });
}
