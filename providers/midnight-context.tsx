'use client';

import './buffer-shim';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { formatUnits } from 'viem';

import { midnightEnv, midnightNetworkId } from '@/lib/midnight/env';
import { MIDNIGHT_TOKENS } from '@/lib/constants/token-metadata';
import {
  midnightTxHistory,
  type MidnightTxRecord,
} from '@/lib/midnight/tx-history';
import { ERC20_TRANSFER_GAS_LIMIT } from '@/lib/midnight/evm-envelope';
import { SWAP_GAS_LIMIT } from '@/lib/midnight/evm-swap';
import type { MidnightBalances } from '@/lib/midnight/vault-balances';

export type { MidnightBalances, MidnightTokenBalance } from '@/lib/midnight/vault-balances';

interface MidnightContextValue {
  connected: boolean;
  connecting: boolean;
  syncStatus: string;
  shieldedAddress: string;
  depositAddress: string;
  vaultAddress: string;
  balances: MidnightBalances | null;
  log: string[];
  connect: () => Promise<void>;
  disconnect: () => void;
  deposit: (erc20Address: string, amountUnits: bigint) => Promise<void>;
  withdraw: (erc20Address: string, amountUnits: bigint, receiver?: string) => Promise<void>;
  swap: (tokenInErc20: string, tokenOutErc20: string, amountUnits: bigint, fee?: bigint, slippageBps?: bigint) => Promise<void>;
  refresh: () => Promise<void>;
}

const MidnightContext = createContext<MidnightContextValue | null>(null);

// Module-level so the wallet starts syncing once at app boot (eager), survives
// StrictMode remounts, and Connect just awaits the in-flight promise. Progress/log go
// through mutable listeners so remounts re-attach to the in-flight sync (a closure over
// the first mount's setState would update an unmounted component and show nothing).
let eagerWallet: Promise<any> | null = null;
let lastSyncStatus = '';
let onSyncStatus: ((s: string) => void) | null = null;
let onWalletLog: ((m: string) => void) | null = null;
const forwardStatus = (s: string) => {
  lastSyncStatus = s;
  onSyncStatus?.(s);
};
const forwardLog = (m: string) => onWalletLog?.(m);

const DEAD_ADDRESS = '0x000000000000000000000000000000000000dEaD';
const MIDNIGHT_ERC20S = MIDNIGHT_TOKENS.map(t => t.erc20Address);

// Relayer funds the gas of the address sending the MPC-signed transfer (parity with the
// Solana bridge's top-up), so the user never hand-funds ETH.
async function topUpGas(fromAddress: string, gasLimit?: bigint): Promise<void> {
  const res = await fetch('/api/midnight/gas-topup', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ fromAddress, gasLimit: gasLimit?.toString() }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body?.error ?? `Gas top-up failed (${res.status})`);
  }
}

export function MidnightProvider({ children }: { children: ReactNode }) {
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [syncStatus, setSyncStatus] = useState('');
  const [shieldedAddress, setShieldedAddress] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [vaultAddress, setVaultAddress] = useState('');
  const [balances, setBalances] = useState<MidnightBalances | null>(null);
  const [log, setLog] = useState<string[]>([]);

  const providersRef = useRef<any>(null);
  const vaultRef = useRef<any>(null);
  const identityRef = useRef<any>(null);
  const walletRef = useRef<any>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const append = (m: string) =>
    setLog(l => [...l, `${new Date().toLocaleTimeString()}  ${m}`]);

  // Token symbol + decimals for the Activity records (decimals come from the synced balances,
  // defaulting to 6 for the demo stablecoins before the first balance read).
  const tokenMeta = (erc20: string) => {
    const t = MIDNIGHT_TOKENS.find(
      x => x.erc20Address.toLowerCase() === erc20.toLowerCase(),
    );
    const decimals = balances?.perToken?.[erc20.toLowerCase()]?.decimals ?? 6;
    return { symbol: t?.symbol ?? 'ERC20', decimals };
  };
  const fmtAmount = (amount: bigint, erc20: string) => {
    const { symbol, decimals } = tokenMeta(erc20);
    return `${formatUnits(amount, decimals)} ${symbol}`;
  };
  const nowSec = () => Math.floor(Date.now() / 1000);

  const startWallet = () => {
    eagerWallet ??= (async () => {
      const { setNetworkId, initializeWallet } = await import('@/lib/midnight/wallet');
      setNetworkId(midnightNetworkId as never);
      return initializeWallet(midnightNetworkId, forwardLog, forwardStatus);
    })().catch(e => {
      eagerWallet = null;
      throw e;
    });
    return eagerWallet;
  };

  // Eager start: begin the chain sync at app boot so Connect doesn't wait for it. This
  // mount becomes the live listener; pick up the status the sync already reached.
  useEffect(() => {
    onSyncStatus = setSyncStatus;
    onWalletLog = append;
    setSyncStatus(lastSyncStatus);
    startWallet().catch(() => {});
    return () => {
      if (onSyncStatus === setSyncStatus) onSyncStatus = null;
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refresh = async () => {
    if (!providersRef.current) return;
    const { readBalances } = await import('@/lib/midnight/vault-balances');
    try {
      setBalances(
        await readBalances(providersRef.current, midnightEnv, MIDNIGHT_ERC20S, depositAddress, vaultAddress),
      );
    } catch {
      /* transient RPC hiccup — keep last */
    }
  };

  const reset = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    eagerWallet = null;
    setSyncStatus('');
    walletRef.current?.stop?.();
    walletRef.current = null;
    providersRef.current = null;
    vaultRef.current = null;
    identityRef.current = null;
    setConnected(false);
    setShieldedAddress('');
    setDepositAddress('');
    setVaultAddress('');
    setBalances(null);
  };

  const connect = async () => {
    if (connecting || connected) return;
    setConnecting(true);
    try {
      const { joinVault, VAULT_PRIVATE_STATE_ID } = await import('@/lib/midnight/wallet');
      const { deriveIdentity, depositAddress: depAddr, vaultAddress: vAddr } =
        await import('@/lib/midnight/vault');

      const handle = await startWallet();
      providersRef.current = handle.providers;
      walletRef.current = handle;
      setShieldedAddress(handle.shielded.shieldedAddress);

      // Persist the deterministic identity so joinVault uses it.
      await handle.providers.privateStateProvider.setContractAddress(midnightEnv.contractAddress);
      await handle.providers.privateStateProvider.set(VAULT_PRIVATE_STATE_ID, {
        secretKey: handle.identitySecret,
      });

      const identity = deriveIdentity(handle.identitySecret);
      identityRef.current = identity;
      vaultRef.current = await joinVault(handle.providers, midnightEnv.contractAddress, handle.identitySecret);

      const dAddr = depAddr(midnightEnv, identity);
      const vaddr = vAddr(midnightEnv);
      setDepositAddress(dAddr);
      setVaultAddress(vaddr);

      const { readBalances } = await import('@/lib/midnight/vault-balances');
      const read = () =>
        readBalances(handle.providers, midnightEnv, MIDNIGHT_ERC20S, dAddr, vaddr);
      setBalances(await read());
      pollRef.current = setInterval(async () => {
        try {
          setBalances(await read());
        } catch {
          /* keep last */
        }
      }, 5000);
      setConnected(true);
      append('Connected (Developer wallet · Midnight)');
    } catch (e) {
      eagerWallet = null;
      append(`Error: ${(e as Error).message}`);
      throw e;
    } finally {
      setConnecting(false);
    }
  };

  const runFlow = async (
    kind: 'deposit' | 'withdraw',
    erc20Address: string,
    amountUnits: bigint,
    receiver?: string,
  ) => {
    const providers = providersRef.current;
    const vault = vaultRef.current;
    const identity = identityRef.current;
    if (!providers || !vault || !identity) throw new Error('Connect the Midnight wallet first.');
    const { runDeposit, runWithdraw } = await import('@/lib/midnight/vault');
    const { flow } = await import('@/lib/midnight/flow');
    flow.start(kind);
    const amountStr = fmtAmount(amountUnits, erc20Address);
    const { symbol } = tokenMeta(erc20Address);
    // The Activity record is keyed by the request id (the deterministic on-chain id) — added when
    // the request lands, patched with the real Sepolia tx hash once the MPC signs, so the row's
    // explorer link is the actual EVM transfer.
    let recordId: string | null = null;
    const record = (
      rid: string,
      base: Omit<MidnightTxRecord, 'id' | 'status' | 'timestampRaw' | 'txHash'>,
      evmTxHash?: string,
    ) => {
      if (recordId === rid) {
        if (evmTxHash) midnightTxHistory.update(rid, { txHash: evmTxHash });
        return;
      }
      recordId = rid;
      midnightTxHistory.add({
        id: rid,
        ...base,
        txHash: evmTxHash,
        status: 'pending',
        timestampRaw: nowSec(),
      });
    };
    try {
      if (kind === 'deposit') {
        append('Requesting gas top-up from relayer...');
        await topUpGas(depositAddress); // sweep is sent FROM the deposit address
        await runDeposit(providers, vault, midnightEnv, identity, erc20Address, amountUnits, append, (rid, hash) =>
          record(
            rid,
            { type: 'Deposit', fromSymbol: 'WALLET', fromAmount: depositAddress, toSymbol: symbol, toAmount: amountStr, counterparty: depositAddress },
            hash,
          ),
        );
      } else {
        const hex = (receiver ?? '').trim().replace(/^0x/, '');
        const destHex = hex.length === 40 ? `0x${hex}` : DEAD_ADDRESS;
        append('Requesting gas top-up from relayer...');
        await topUpGas(vaultAddress); // payout is sent FROM the vault address
        await runWithdraw(providers, vault, midnightEnv, identity, erc20Address, amountUnits, destHex, append, () => topUpGas(vaultAddress), (rid, hash) =>
          record(
            rid,
            { type: 'Withdraw', fromSymbol: symbol, fromAmount: amountStr, toSymbol: 'WALLET', toAmount: destHex, counterparty: destHex },
            hash,
          ),
        );
      }
      if (recordId)
        midnightTxHistory.update(recordId, { status: flow.refunded ? 'refunded' : 'completed' });
      await refresh();
    } catch (e) {
      if (recordId) midnightTxHistory.update(recordId, { status: 'failed' });
      flow.fail((e as Error).message);
      throw e;
    }
  };

  // Swap has two tokens (in/out), so it doesn't fit runFlow's single-erc20 signature. The
  // swap is signed + paid by the VAULT account (it holds the pooled funds), so top up the
  // vault for the swap's larger gas envelope PLUS a possible one-time router approval.
  const runSwapFlow = async (
    tokenInErc20: string,
    tokenOutErc20: string,
    amountUnits: bigint,
    fee = 500n,
    slippageBps = 100n,
  ) => {
    const providers = providersRef.current;
    const vault = vaultRef.current;
    const identity = identityRef.current;
    if (!providers || !vault || !identity) throw new Error('Connect the Midnight wallet first.');
    const { runSwap } = await import('@/lib/midnight/vault');
    const { flow } = await import('@/lib/midnight/flow');
    flow.start('swap');
    let recordId: string | null = null;
    const record = (rid: string, evmTxHash?: string) => {
      if (recordId === rid) {
        if (evmTxHash) midnightTxHistory.update(rid, { txHash: evmTxHash });
        return;
      }
      recordId = rid;
      midnightTxHistory.add({
        id: rid,
        type: 'Swap',
        fromSymbol: tokenMeta(tokenInErc20).symbol,
        fromAmount: fmtAmount(amountUnits, tokenInErc20),
        toSymbol: tokenMeta(tokenOutErc20).symbol,
        toAmount: '',
        txHash: evmTxHash,
        status: 'pending',
        timestampRaw: nowSec(),
      });
    };
    try {
      append('Requesting gas top-up from relayer...');
      await topUpGas(vaultAddress, SWAP_GAS_LIMIT + ERC20_TRANSFER_GAS_LIMIT);
      await runSwap(providers, vault, midnightEnv, identity, tokenInErc20, tokenOutErc20, amountUnits, append, fee, slippageBps,
        () => topUpGas(vaultAddress, SWAP_GAS_LIMIT + ERC20_TRANSFER_GAS_LIMIT),
        (rid, hash) => record(rid, hash),
      );
      if (recordId)
        midnightTxHistory.update(recordId, { status: flow.refunded ? 'refunded' : 'completed' });
      await refresh();
    } catch (e) {
      if (recordId) midnightTxHistory.update(recordId, { status: 'failed' });
      flow.fail((e as Error).message);
      throw e;
    }
  };

  return (
    <MidnightContext.Provider
      value={{
        connected,
        connecting,
        syncStatus,
        shieldedAddress,
        depositAddress,
        vaultAddress,
        balances,
        log,
        connect,
        disconnect: reset,
        deposit: (erc20, amount) => runFlow('deposit', erc20, amount),
        withdraw: (erc20, amount, receiver) => runFlow('withdraw', erc20, amount, receiver),
        swap: (tokenIn, tokenOut, amount, fee, slippageBps) =>
          runSwapFlow(tokenIn, tokenOut, amount, fee, slippageBps),
        refresh,
      }}
    >
      {children}
    </MidnightContext.Provider>
  );
}

export function useMidnightWallet(): MidnightContextValue {
  const ctx = useContext(MidnightContext);
  if (!ctx) throw new Error('useMidnightWallet must be used within a MidnightProvider');
  return ctx;
}
