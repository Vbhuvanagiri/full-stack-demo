// Deposit/withdraw/swap lifecycle state; vault.ts pushes phases, the UI subscribes.

export type FlowKind = 'deposit' | 'withdraw' | 'swap';

export type FlowPhase =
  | 'preparing'
  | 'proving'
  | 'settling'
  | 'claim-proving'
  | 'refunding'
  | 'done';

export type FlowState = {
  kind: FlowKind | null;
  phase: FlowPhase | null;
  error: string | null;
  // Set once the flow ends by refunding (the on-chain leg failed but funds were re-minted), so
  // the UI can show a distinct "didn't execute — refunded" terminal instead of a success.
  refunded: boolean;
};

type Listener = (s: FlowState) => void;

class Flow {
  kind: FlowKind | null = null;
  phase: FlowPhase | null = null;
  error: string | null = null;
  refunded = false;
  private listeners = new Set<Listener>();

  start(kind: FlowKind) {
    this.kind = kind; this.phase = 'preparing'; this.error = null; this.refunded = false; this.emit();
  }
  set(phase: FlowPhase) { this.phase = phase; this.error = null; this.emit(); }
  fail(message: string) { this.error = message; this.emit(); }
  // Terminal reached via refund: the on-chain leg failed but the surrendered funds were re-minted.
  finishRefunded() { this.phase = 'done'; this.refunded = true; this.emit(); }
  reset() { this.kind = null; this.phase = null; this.error = null; this.refunded = false; this.emit(); }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    l(this.snapshot());
    return () => { this.listeners.delete(l); };
  }
  private snapshot(): FlowState { return { kind: this.kind, phase: this.phase, error: this.error, refunded: this.refunded }; }
  private emit() { const s = this.snapshot(); for (const l of this.listeners) l(s); }
}

export const flow = new Flow();

export const PHASE_MESSAGE: Record<FlowPhase, string> = {
  preparing: 'Preparing…',
  proving: 'Generating proof (runs locally, can take minutes)…',
  settling: 'MPC signing + settling on Sepolia…',
  'claim-proving': 'Generating settlement proof…',
  refunding: 'On-chain leg failed — refunding your tokens…',
  done: 'Done',
};
