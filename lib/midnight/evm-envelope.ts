// The vault's fixed EIP-1559 transfer envelope — single source of truth shared by the
// client flow (vault.ts: request-id + signed tx) and the server gas top-up route (which
// must fund the sender to cover the exact upfront reservation gasLimit * maxFeePerGas).
// Dependency-free on purpose: the server route must not pull in the wallet/WASM stack.
export const ERC20_TRANSFER_GAS_LIMIT = 100_000n;
export const ERC20_TRANSFER_MAX_FEE_PER_GAS = 30_000_000_000n; // 30 gwei
export const ERC20_TRANSFER_MAX_PRIORITY_FEE_PER_GAS = 1_000_000_000n; // 1 gwei
