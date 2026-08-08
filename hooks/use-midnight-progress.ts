'use client';

import { useEffect, useState } from 'react';

import { flow, PHASE_MESSAGE, type FlowState } from '@/lib/midnight/flow';

// Expose the Midnight flow as a message for the existing LoadingState UI.
export function useMidnightProgress(): {
  active: boolean;
  message: string;
  error: string | null;
} {
  const [s, setS] = useState<FlowState>({
    kind: flow.kind,
    phase: flow.phase,
    error: flow.error,
    refunded: flow.refunded,
  });
  useEffect(() => flow.subscribe(setS), []);
  return {
    // A failed flow is terminal, not active — otherwise its lingering phase would keep the
    // swap/deposit buttons disabled after an error (flow.fail leaves phase set for the message).
    active: !!s.phase && s.phase !== 'done' && !s.error,
    message: s.phase ? (PHASE_MESSAGE[s.phase] ?? 'Working…') : 'Working…',
    error: s.error,
  };
}
