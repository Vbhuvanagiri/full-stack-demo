'use client';

import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

import { flow, PHASE_MESSAGE, type FlowState } from '@/lib/midnight/flow';

// Midnight deposit/withdraw progress as a single updating toast (mirrors the base app's
// transaction-status-tracker), so flows are dismissible and progress shows like EVM/Solana.
const TOAST_ID = 'midnight-flow-progress';

export function MidnightProgressToaster() {
  const prevPhase = useRef<string | null>(null);

  useEffect(() => {
    const onState = (s: FlowState) => {
      const kind =
        s.kind === 'withdraw'
          ? 'Withdrawal'
          : s.kind === 'swap'
            ? 'Swap'
            : 'Deposit';

      if (s.error) {
        prevPhase.current = null;
        toast.error(`${kind} failed`, { id: TOAST_ID, description: s.error });
        return;
      }
      if (!s.phase) {
        prevPhase.current = null;
        return;
      }
      if (s.phase === 'done') {
        prevPhase.current = null;
        if (s.refunded) {
          toast.warning(`${kind} didn't execute on-chain — tokens refunded`, {
            id: TOAST_ID,
          });
          return;
        }
        toast.success(
          s.kind === 'withdraw'
            ? 'Withdrawal complete'
            : s.kind === 'swap'
              ? 'Swap complete — shielded token minted'
              : 'Deposit complete — shielded token minted',
          { id: TOAST_ID },
        );
        return;
      }
      if (s.phase !== prevPhase.current) {
        prevPhase.current = s.phase;
        toast.loading(`${kind}: ${PHASE_MESSAGE[s.phase] ?? 'Working…'}`, {
          id: TOAST_ID,
        });
      }
    };
    return flow.subscribe(onState);
  }, []);

  return null;
}
