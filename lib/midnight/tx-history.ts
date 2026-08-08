'use client';

// Session-scoped history of Midnight vault operations (deposit / withdraw / swap) for the Activity
// table. Unlike the Ethereum (Redis) and Solana sources, the vault flows leave no server-side
// record, so this in-memory observable log lets the Activity list show them alongside the other
// chains. It resets on reload — the vault's authoritative state is the shielded balance, not this.

export type MidnightTxType = 'Deposit' | 'Withdraw' | 'Swap';
export type MidnightTxStatus = 'pending' | 'completed' | 'failed' | 'refunded';

export interface MidnightTxRecord {
  id: string;
  type: MidnightTxType;
  fromSymbol: string;
  fromAmount: string; // pre-formatted, may be an address for the WALLET side
  toSymbol: string;
  toAmount: string;
  counterparty?: string; // deposit address / withdraw destination
  status: MidnightTxStatus;
  timestampRaw: number; // unix seconds
  txHash?: string; // Sepolia tx hash, when known
}

type Listener = (txs: MidnightTxRecord[]) => void;

class MidnightTxHistory {
  private txs: MidnightTxRecord[] = [];
  private listeners = new Set<Listener>();

  /** Insert (or replace by id) a record, newest first. */
  add(rec: MidnightTxRecord) {
    this.txs = [rec, ...this.txs.filter(t => t.id !== rec.id)];
    this.emit();
  }

  /** Patch an existing record (e.g. pending -> completed/failed/refunded, add a tx hash). */
  update(id: string, patch: Partial<MidnightTxRecord>) {
    this.txs = this.txs.map(t => (t.id === id ? { ...t, ...patch } : t));
    this.emit();
  }

  subscribe(l: Listener): () => void {
    this.listeners.add(l);
    l(this.txs);
    return () => {
      this.listeners.delete(l);
    };
  }

  private emit() {
    const snap = this.txs;
    for (const l of this.listeners) l(snap);
  }
}

export const midnightTxHistory = new MidnightTxHistory();
