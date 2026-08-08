# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
pnpm dev          # Start dev server with Turbopack
pnpm build        # Production build
pnpm lint         # ESLint check
pnpm lint:fix     # ESLint auto-fix
pnpm typecheck    # TypeScript type checking
pnpm format       # Prettier check
pnpm format:fix   # Prettier format
pnpm generate:idl # Regenerate Anchor IDL types from ../contract
```

## Architecture Overview

Cross-chain bridge frontend enabling ERC20 transfers between Solana and EVM chains using MPC signatures via Chain Signatures protocol.

### Provider Hierarchy

```text
QueryClientProvider (TanStack Query)
  └── WagmiProvider (EVM wallets)
       └── ConnectionProvider (Solana RPC)
            └── AppProvider (@solana/connector headless wallet)
                 └── PendingTransactionsProvider
                      └── App
```

### Key Layers

**Service Layer** (`lib/services/`):

- `CrossChainOrchestrator` - Coordinates MPC signature events with timeouts and backfill
- `DepositService` / `WithdrawalService` - Build Solana instructions for bridge operations
- `TokenBalanceService` - On-chain balance queries

**Contract Clients** (`lib/contracts/`):

- `DexContract` - Wraps Anchor program (deposit, claim, withdraw instructions)
- `ChainSignaturesContract` - Listens for MPC `Signature` and `RespondBidirectional` events

**Relayer** (`lib/relayer/`):

- `handlers.ts` - Server-side `handleDeposit`/`handleWithdrawal` flows
- `tx-registry.ts` - Redis-backed transaction tracking (7-day TTL)
- `embedded-signer.ts` - MPC signer setup

**EVM Layer** (`lib/evm/`):

- `tx-builder.ts` - Builds ERC20 transfer transactions
- `tx-submitter.ts` - Submits with retry logic
- `gas-topup.ts` - Automatic gas funding when needed

### Transaction Status Flow

```text
pending → balance_polling → gas_topup_pending → solana_pending →
signature_pending → ethereum_pending → completing → completed|failed
```

Status tracked in Redis via `tx:{trackingId}` keys, polled by frontend every 2s.

### Cross-Chain Flows

**Deposit (EVM → Solana):**

1. User sends ERC20 to derived deposit address
2. `/api/notify-deposit` spawns background handler via `after()`
3. Relayer polls for token arrival → gas topup if needed → builds EVM tx
4. Waits for MPC signature event (30s backfill at timeout)
5. Submits to Ethereum → calls `claimErc20` on Solana

**Withdrawal (Solana → EVM):**

1. Frontend submits `withdrawErc20` instruction
2. `/api/notify-withdrawal` processes with pre-built EVM tx params
3. Waits for MPC signature → submits to Ethereum
4. Calls `completeWithdrawErc20` on Solana

### PDA Derivation

Centralized in `lib/constants/addresses.ts`:

- `deriveVaultAuthorityPda(userPublicKey)` - Per-user vault
- `derivePendingDepositPda(requestIdBytes)` - Pending deposit accounts
- `derivePendingWithdrawalPda(requestIdBytes)` - Pending withdrawal accounts
- `deriveUserBalancePda(userPublicKey, erc20AddressBytes)` - User token balances
- `deriveEthereumAddress(path, requesterAddress, basePublicKey)` - Derives EVM address from MPC key

### Query Keys & Cache Invalidation

React Query keys in `lib/query-client.ts` via `queryKeys` object. Use `invalidateBalanceQueries()` helper for balance refreshes.

Real-time updates via `useBridgeAutoRefetch` hook which subscribes to Solana program logs and invalidates queries on relevant instructions.

## Environment Configuration

Validated via Zod in `lib/config/env.config.ts`:

- `getClientEnv()` - Client-safe vars (NEXT_PUBLIC_*)
- `getFullEnv()` - Server-side only (includes secrets)

Server-side requires: `RELAYER_PRIVATE_KEY` (JSON array), `REDIS_URL`, `REDIS_TOKEN`

## API Routes

All routes use `runtime: 'nodejs'` with `maxDuration: 300` for long-running relayer operations:

- `/api/notify-deposit` - Trigger deposit monitoring
- `/api/notify-withdrawal` - Process withdrawal
- `/api/tx-status/[id]` - Poll transaction status
- `/api/tx-list` - List user transactions

## Code Conventions

- Path alias: `@/*` maps to project root
- Unused variables must be prefixed with `_`
- TypeScript strict mode with `noUncheckedIndexedAccess`
- All pages are client components (`'use client'`) with `export const dynamic = 'force-dynamic'`
- All caching must go through React Query - no custom caching solutions
- Never hardcode token decimals - always fetch from on-chain via `fetchTokenDecimals()`
- **Do not use `useMemo`, `useCallback`, or `React.memo`** - React Compiler handles memoization automatically

## Before Completing Any Task

```bash
pnpm lint && pnpm typecheck
```

Only run `pnpm build` if explicitly asked.
