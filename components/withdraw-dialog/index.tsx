'use client';

import { useState } from 'react';
import { toast } from 'sonner';

import { parseUnits } from 'viem';

import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { LoadingState } from '@/components/states/LoadingState';
import { useWithdrawEvmMutation, useWithdrawSolMutation, useHasActiveTransaction } from '@/hooks';
import { useMidnightWallet } from '@/providers/midnight-context';
import { useMidnightProgress } from '@/hooks/use-midnight-progress';

import { AmountInput } from './amount-input';

export interface WithdrawToken {
  symbol: string;
  name: string;
  chain: 'ethereum' | 'solana' | 'midnight';
  chainName: string;
  address: string;
  balance: string;
  decimals: number;
}

interface WithdrawDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableTokens: WithdrawToken[];
  preSelectedToken?: WithdrawToken | null;
}

function WithdrawDialogContent({
  availableTokens,
  preSelectedToken,
  onClose,
}: {
  availableTokens: WithdrawToken[];
  preSelectedToken?: WithdrawToken | null;
  onClose: () => void;
}) {
  const [isProcessing, setIsProcessing] = useState(false);

  const withdrawEvmMutation = useWithdrawEvmMutation();
  const withdrawSolMutation = useWithdrawSolMutation();
  const hasActiveTransaction = useHasActiveTransaction();
  const midnightWallet = useMidnightWallet();
  const midnight = useMidnightProgress();

  const handleAmountSubmit = async (data: {
    token: WithdrawToken;
    amount: string;
    receiverAddress: string;
  }) => {
    if (hasActiveTransaction) {
      toast.error('Transaction in progress', {
        description: 'Please wait for the current transaction to complete',
      });
      return;
    }
    // Midnight: fire-and-close — progress + result surface via MidnightProgressToaster.
    if (data.token.chain === 'midnight') {
      const units = parseUnits(data.amount, data.token.decimals);
      midnightWallet.withdraw(data.token.address, units, data.receiverAddress).catch(() => {
        /* surfaced by MidnightProgressToaster via flow.fail */
      });
      onClose();
      return;
    }

    setIsProcessing(true);

    try {
      if (data.token.chain === 'solana') {
        await withdrawSolMutation.mutateAsync({
          mintAddress: data.token.address,
          amount: data.amount,
          recipientAddress: data.receiverAddress,
          decimals: data.token.decimals,
        });
      } else {
        await withdrawEvmMutation.mutateAsync({
          erc20Address: data.token.address,
          amount: data.amount,
          recipientAddress: data.receiverAddress,
        });
      }

      onClose();
    } catch (err) {
      toast.error('Withdrawal failed', {
        description: err instanceof Error ? err.message : 'Unknown error',
      });
      setIsProcessing(false);
    }
  };

  return (
    <>
      <DialogTitle>Send</DialogTitle>
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {!isProcessing && (
          <AmountInput
            availableTokens={availableTokens}
            onSubmit={handleAmountSubmit}
            preSelectedToken={preSelectedToken}
          />
        )}
        {isProcessing && (
          <LoadingState
            message={
              midnight.active ? midnight.message : 'Awaiting wallet confirmation…'
            }
          />
        )}
      </div>
    </>
  );
}

export function WithdrawDialog({
  open,
  onOpenChange,
  availableTokens,
  preSelectedToken,
}: WithdrawDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='flex max-h-[90vh] max-w-md flex-col overflow-hidden p-6 sm:p-8'>
        {open && (
          <WithdrawDialogContent
            availableTokens={availableTokens}
            preSelectedToken={preSelectedToken}
            onClose={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
