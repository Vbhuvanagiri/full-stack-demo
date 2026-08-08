import { useQuery } from '@tanstack/react-query';

import type { TxEntry, TxStatus } from '@/lib/relayer/tx-registry';

interface TxStatusResponse extends TxEntry {
  onChain?: boolean;
}

export function useTxStatus(trackingId: string | null) {
  return useQuery<TxStatusResponse | null>({
    queryKey: ['txStatus', trackingId],
    queryFn: async () => {
      if (!trackingId) return null;
      const res = await fetch(`/api/tx-status/${trackingId}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        const errorText = await res.text().catch(() => 'No response body');
        throw new Error(
          `Failed to fetch transaction status: ${res.status} ${res.statusText} - ${errorText}`,
        );
      }
      return res.json();
    },
    enabled: !!trackingId,
    refetchInterval: query => {
      // Poll every 5s while pending, stop when completed/failed
      const status = query.state.data?.status;
      if (status === 'completed' || status === 'failed') return false;
      return 5000;
    },
    refetchIntervalInBackground: false,
    staleTime: 5000,
  });
}

// Status display helpers
export function getStatusLabel(status: TxStatus): string {
  const labels: Record<TxStatus, string> = {
    pending: 'Pending',
    balance_polling: 'Waiting for deposit',
    gas_topup_pending: 'Funding gas',
    solana_pending: 'Processing on-chain',
    signature_pending: 'Awaiting signature',
    ethereum_pending: 'Processing on Ethereum',
    completing: 'Finalizing',
    completed: 'Completed',
    failed: 'Failed',
  };
  return labels[status] || status;
}

export function isTerminalStatus(status: TxStatus): boolean {
  return status === 'completed' || status === 'failed';
}

export function getStatusProgress(status: TxStatus): number {
  const progressMap: Record<TxStatus, number> = {
    pending: 0,
    balance_polling: 15,
    gas_topup_pending: 22,
    solana_pending: 30,
    signature_pending: 50,
    ethereum_pending: 70,
    completing: 90,
    completed: 100,
    failed: 100,
  };
  return progressMap[status] || 0;
}
