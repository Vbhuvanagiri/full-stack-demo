import type { EvmTransactionRequestNotifyWithdrawal } from '@/lib/types/shared.types';
import { getClientEnv } from '@/lib/config/env.config';

export interface NotifyDepositResponse {
  accepted: boolean;
  trackingId: string;
}

export async function notifyDeposit({
  userAddress,
  erc20Address,
  ethereumAddress,
  tokenDecimals,
  tokenSymbol,
}: {
  userAddress: string;
  erc20Address: string;
  ethereumAddress: string;
  tokenDecimals?: number;
  tokenSymbol?: string;
}): Promise<NotifyDepositResponse> {
  const env = getClientEnv();
  const url = env.NEXT_PUBLIC_NOTIFY_DEPOSIT_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_NOTIFY_DEPOSIT_URL is not set');
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userAddress,
      erc20Address,
      ethereumAddress,
      tokenDecimals,
      tokenSymbol,
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `Relayer notifyDeposit failed: ${res.status} ${res.statusText} - ${text}`,
    );
  }
  return res.json();
}

export async function notifyWithdrawal({
  requestId,
  erc20Address,
  userAddress,
  recipientAddress,
  transactionParams,
  tokenAmount,
  tokenDecimals,
  tokenSymbol,
  solanaInitTxHash,
  blockhash,
  lastValidBlockHeight,
}: {
  requestId: string;
  erc20Address: string;
  userAddress: string;
  recipientAddress: string;
  transactionParams?: EvmTransactionRequestNotifyWithdrawal;
  tokenAmount?: string;
  tokenDecimals?: number;
  tokenSymbol?: string;
  solanaInitTxHash?: string;
  blockhash?: string;
  lastValidBlockHeight?: number;
}): Promise<void> {
  const env = getClientEnv();
  const url = env.NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL;
  if (!url) {
    throw new Error('NEXT_PUBLIC_NOTIFY_WITHDRAWAL_URL is not set');
  }
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      requestId,
      erc20Address,
      userAddress,
      recipientAddress,
      transactionParams,
      tokenAmount,
      tokenDecimals,
      tokenSymbol,
      solanaInitTxHash,
      blockhash,
      lastValidBlockHeight,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Relayer notification failed: ${response.status} ${response.statusText} - ${errorText}`,
    );
  }
}
