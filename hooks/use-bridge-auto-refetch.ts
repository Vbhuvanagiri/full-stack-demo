'use client';

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { useConnection } from '@/providers/providers';
import {
  BRIDGE_PROGRAM_ID,
  deriveUserBalancePda,
  deriveVaultAuthorityPda,
} from '@/lib/constants/addresses';
import { ERC20_TOKENS } from '@/lib/constants/token-metadata';
import { queryKeys } from '@/lib/query-client';
import { PublicKey } from '@solana/web3.js';

import { useSolanaPublicKey } from './use-solana-public-key';

function buildUserBalancePdaSet(publicKey: PublicKey | null) {
  if (!publicKey) return new Set<string>();
  const set = new Set<string>();
  for (const token of ERC20_TOKENS) {
    try {
      const erc20Bytes = Buffer.from(token.erc20Address.replace('0x', ''), 'hex');
      const [pda] = deriveUserBalancePda(publicKey, erc20Bytes);
      set.add(pda.toBase58());
    } catch {}
  }
  return set;
}

function getRequesterPdaBase58(publicKey: PublicKey | null) {
  if (!publicKey) return null;
  try {
    const [pda] = deriveVaultAuthorityPda(publicKey);
    return pda.toBase58();
  } catch {
    return null;
  }
}

/**
 * useBridgeAutoRefetch subscribes to on-chain logs for our program
 * Uses a single consolidated subscription instead of multiple individual ones
 *
 * This provides near-real-time updates for:
 * - Deposits: claimErc20
 * - Withdrawals: completeWithdrawErc20
 */
export function useBridgeAutoRefetch() {
  const { connection } = useConnection();
  const queryClient = useQueryClient();
  const publicKey = useSolanaPublicKey();

  const userBalancePdaSet = buildUserBalancePdaSet(publicKey);
  const requesterPdaBase58 = getRequesterPdaBase58(publicKey);

  useEffect(() => {
    if (!publicKey || userBalancePdaSet.size === 0) return;

    const pk = publicKey.toString();

    let programSubId: number | undefined;

    try {
      programSubId = connection.onLogs(
        BRIDGE_PROGRAM_ID,
        async logs => {
          try {
            const raw = logs.logs.join('\n');

            const isRelevantInstruction =
              raw.includes('Instruction: completeWithdrawErc20') ||
              raw.includes('Instruction: claimErc20') ||
              raw.includes('Instruction: withdrawErc20') ||
              raw.includes('Instruction: depositErc20');

            if (!isRelevantInstruction) return;

            const mentionsUserPda = Array.from(userBalancePdaSet).some(pda =>
              raw.includes(pda),
            );
            const mentionsRequesterPda =
              requesterPdaBase58 && raw.includes(requesterPdaBase58);

            if (!mentionsUserPda && !mentionsRequesterPda) {
              return;
            }

            const isCompletion =
              raw.includes('completeWithdrawErc20') ||
              raw.includes('claimErc20');
            const isInitiation =
              raw.includes('withdrawErc20') || raw.includes('depositErc20');

            const queriesToInvalidate: Array<{ queryKey: readonly string[] }> =
              [];

            if (isCompletion) {
              queriesToInvalidate.push(
                { queryKey: queryKeys.solana.userBalances(pk) },
              );
            }

            if (isCompletion || isInitiation) {
              queriesToInvalidate.push(
                { queryKey: queryKeys.solana.txList(pk) },
              );
            }

            if (queriesToInvalidate.length > 0) {
              await Promise.all(
                queriesToInvalidate.map(query =>
                  queryClient.invalidateQueries(query),
                ),
              );
            }
          } catch (error) {
            console.error('[BridgeAutoRefetch] Error processing logs:', error);
          }
        },
        'confirmed',
      );
    } catch (error) {
      console.warn(
        '[BridgeAutoRefetch] Failed to create log subscription:',
        error,
      );
    }

    return () => {
      if (programSubId !== undefined) {
        try {
          connection.removeOnLogsListener(programSubId).catch(() => {});
        } catch {}
      }
    };
  }, [
    connection,
    publicKey,
    userBalancePdaSet,
    requesterPdaBase58,
    queryClient,
  ]);
}
