'use client';

import { CheckCircle, Circle, XCircle, Loader2, ExternalLink } from 'lucide-react';

import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { useTxStatus, getStatusLabel } from '@/hooks/use-tx-status';
import type { TxStatus } from '@/lib/relayer/tx-registry';

import type { ActivityTransaction } from './index';

interface TransactionDetailsDialogProps {
  transaction: ActivityTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface StepConfig {
  status: TxStatus;
  label: string;
  description: string;
}

const DEPOSIT_STEPS: StepConfig[] = [
  {
    status: 'pending',
    label: 'Initiated',
    description: 'Transaction has been initiated',
  },
  {
    status: 'balance_polling',
    label: 'Detecting Deposit',
    description: 'Waiting for your deposit to be confirmed on Ethereum',
  },
  {
    status: 'gas_topup_pending',
    label: 'Funding Gas',
    description: 'Sending ETH to cover transaction gas fees',
  },
  {
    status: 'solana_pending',
    label: 'Processing on-chain',
    description: 'Creating deposit record on-chain',
  },
  {
    status: 'signature_pending',
    label: 'MPC Signature',
    description: 'Obtaining multi-party signature for authorization',
  },
  {
    status: 'ethereum_pending',
    label: 'Ethereum Transaction',
    description: 'Executing transaction on Ethereum',
  },
  {
    status: 'completing',
    label: 'Finalizing',
    description: 'Completing the cross-chain transfer',
  },
  {
    status: 'completed',
    label: 'Completed',
    description: 'Transaction completed successfully',
  },
];

const WITHDRAWAL_STEPS: StepConfig[] = [
  {
    status: 'pending',
    label: 'Initiated',
    description: 'Withdrawal request submitted to relayer',
  },
  {
    status: 'gas_topup_pending',
    label: 'Funding Gas',
    description: 'Sending ETH to cover transaction gas fees',
  },
  {
    status: 'signature_pending',
    label: 'MPC Signature',
    description: 'Obtaining multi-party signature for authorization',
  },
  {
    status: 'ethereum_pending',
    label: 'Ethereum Transaction',
    description: 'Executing withdrawal on Ethereum',
  },
  {
    status: 'completing',
    label: 'Finalizing',
    description: 'Completing the withdrawal on-chain',
  },
  {
    status: 'completed',
    label: 'Completed',
    description: 'Withdrawal completed successfully',
  },
];

function getStepIndex(status: TxStatus, steps: StepConfig[]): number {
  const index = steps.findIndex(step => step.status === status);
  return index >= 0 ? index : 0;
}

function StepIndicator({
  step,
  currentIndex,
  stepIndex,
  isFailed,
  isTransactionCompleted,
}: {
  step: StepConfig;
  currentIndex: number;
  stepIndex: number;
  isFailed: boolean;
  isTransactionCompleted: boolean;
}) {
  // When transaction is completed, all steps including the last one should show as completed
  const isCompleted = stepIndex < currentIndex || (isTransactionCompleted && stepIndex === currentIndex);
  const isCurrent = stepIndex === currentIndex && !isTransactionCompleted;
  const isPending = stepIndex > currentIndex;

  return (
    <div className='flex items-start gap-3'>
      <div className='flex flex-col items-center'>
        <div
          className={cn(
            'flex h-8 w-8 items-center justify-center rounded-full',
            isCompleted && 'bg-success-100',
            isCurrent && !isFailed && 'bg-blue-100',
            isCurrent && isFailed && 'bg-red-100',
            isPending && 'bg-gray-100',
          )}
        >
          {isCompleted && <CheckCircle className='h-5 w-5 text-success-600' />}
          {isCurrent && !isFailed && (
            <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
          )}
          {isCurrent && isFailed && <XCircle className='h-5 w-5 text-red-600' />}
          {isPending && <Circle className='h-5 w-5 text-gray-400' />}
        </div>
        {stepIndex < DEPOSIT_STEPS.length - 1 && (
          <div
            className={cn(
              'mt-1 h-8 w-0.5',
              isCompleted ? 'bg-success-300' : 'bg-gray-200',
            )}
          />
        )}
      </div>
      <div className='flex-1 pb-4'>
        <p
          className={cn(
            'font-medium',
            isCompleted && 'text-success-700',
            isCurrent && !isFailed && 'text-blue-700',
            isCurrent && isFailed && 'text-red-700',
            isPending && 'text-gray-400',
          )}
        >
          {step.label}
        </p>
        <p
          className={cn(
            'text-sm',
            isCompleted && 'text-success-600',
            isCurrent && 'text-gray-600',
            isPending && 'text-gray-400',
          )}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function TransactionDetailsDialog({
  transaction,
  open,
  onOpenChange,
}: TransactionDetailsDialogProps) {
  const { data: txStatus } = useTxStatus(transaction?.id ?? null);

  // Determine which steps to show based on transaction type
  const isDeposit = transaction?.type === 'Deposit';
  const hasGasTopUp = !!txStatus?.gasTopUpTxHash;
  const baseSteps = isDeposit ? DEPOSIT_STEPS : WITHDRAWAL_STEPS;
  const steps = hasGasTopUp
    ? baseSteps
    : baseSteps.filter(s => s.status !== 'gas_topup_pending');

  // Get current status - prefer real-time status from API if available
  const currentStatus: TxStatus =
    txStatus?.status ??
    (transaction?.status === 'completed'
      ? 'completed'
      : transaction?.status === 'failed'
        ? 'failed'
        : 'pending');

  const isFailed = currentStatus === 'failed';
  const isCompleted = currentStatus === 'completed';
  const currentIndex = isFailed
    ? getStepIndex(txStatus?.status ?? 'pending', steps)
    : isCompleted
      ? steps.length - 1
      : getStepIndex(currentStatus, steps);

  if (!transaction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-lg overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>
            {isDeposit ? 'Deposit' : 'Withdrawal'} Details
          </DialogTitle>
          <DialogDescription>
            {isCompleted
              ? 'Your transaction has been completed successfully.'
              : isFailed
                ? 'Your transaction encountered an error.'
                : `Status: ${getStatusLabel(currentStatus)}`}
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4'>
          {/* Progress Steps */}
          <div className='space-y-0'>
            {steps.map((step, index) => (
              <StepIndicator
                key={step.status}
                step={step}
                currentIndex={currentIndex}
                stepIndex={index}
                isFailed={isFailed && index === currentIndex}
                isTransactionCompleted={isCompleted}
              />
            ))}
          </div>

          {/* Error message */}
          {isFailed && txStatus?.error && (
            <div className='mt-4 rounded-md bg-red-50 p-3'>
              <p className='text-sm font-medium text-red-800'>Error</p>
              <p className='mt-1 text-sm text-red-600 break-all'>{txStatus.error}</p>
            </div>
          )}

          {/* Transaction hashes - ordered by execution flow */}
          <div className='mt-4 space-y-2 border-t pt-4'>
            <p className='text-xs font-medium text-gray-500 mb-2'>Transaction Flow</p>

            {/* Step 1: Gas Top-Up (only shown if a top-up was needed) */}
            {txStatus?.gasTopUpTxHash && (
              <div className='flex items-center justify-between text-sm'>
                <span className='text-gray-500'>1. Gas Top-Up</span>
                <a
                  href={`https://sepolia.etherscan.io/tx/${txStatus.gasTopUpTxHash}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-blue-600 hover:underline'
                >
                  {txStatus.gasTopUpTxHash.slice(0, 10)}...
                  <ExternalLink className='h-3 w-3' />
                </a>
              </div>
            )}

            {/* Step 2: Solana Init (deposit or withdrawal initiation) */}
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-500'>
                {txStatus?.gasTopUpTxHash ? '2' : '1'}. On-chain {isDeposit ? 'Init Deposit' : 'Init Withdraw'}
              </span>
              {txStatus?.solanaInitTxHash ? (
                <a
                  href={`https://explorer.solana.com/tx/${txStatus.solanaInitTxHash}?cluster=devnet`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-blue-600 hover:underline'
                >
                  {txStatus.solanaInitTxHash.slice(0, 8)}...
                  <ExternalLink className='h-3 w-3' />
                </a>
              ) : (
                <span className='text-gray-400'>Pending...</span>
              )}
            </div>

            {/* Step 3: Ethereum Transaction */}
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-500'>
                {txStatus?.gasTopUpTxHash ? '3' : '2'}. Ethereum {isDeposit ? 'Deposit' : 'Withdraw'}
              </span>
              {txStatus?.ethereumTxHash || transaction.transactionHash ? (
                <a
                  href={`https://sepolia.etherscan.io/tx/${txStatus?.ethereumTxHash || transaction.transactionHash}`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-blue-600 hover:underline'
                >
                  {(txStatus?.ethereumTxHash || transaction.transactionHash)?.slice(0, 10)}...
                  <ExternalLink className='h-3 w-3' />
                </a>
              ) : (
                <span className='text-gray-400'>Pending...</span>
              )}
            </div>

            {/* Step 4: Solana Finalize (claim or complete withdrawal) */}
            <div className='flex items-center justify-between text-sm'>
              <span className='text-gray-500'>
                {txStatus?.gasTopUpTxHash ? '4' : '3'}. On-chain {isDeposit ? 'Claim' : 'Finalize'}
              </span>
              {txStatus?.solanaFinalizeTxHash ? (
                <a
                  href={`https://explorer.solana.com/tx/${txStatus.solanaFinalizeTxHash}?cluster=devnet`}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex items-center gap-1 text-blue-600 hover:underline'
                >
                  {txStatus.solanaFinalizeTxHash.slice(0, 8)}...
                  <ExternalLink className='h-3 w-3' />
                </a>
              ) : (
                <span className='text-gray-400'>Pending...</span>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
