// The vault contract package's non-compiled exports, replicated in the app (the
// @midnight-examples/erc20-vault-contract workspace package is TS-only + Node-oriented,
// so we vendor the compiled contract/index.js and re-declare these tiny pieces here).
import {
  Contract,
  pureCircuits,
  ledger,
  type Witnesses,
} from './managed/erc20-vault/contract/index.js';

/** Private state carried through vault circuit calls: the caller's identity secret. */
export interface VaultPrivateState {
  readonly secretKey: Uint8Array;
}

/** Build the vault's private state from the 32-byte identity secret. */
export const createVaultPrivateState = (
  secretKey: Uint8Array,
): VaultPrivateState => ({ secretKey });

/** callerSecretKey feeds the contract's identity commitment from private state. */
export const witnesses: Witnesses<VaultPrivateState> = {
  callerSecretKey: ({ privateState }: any): [VaultPrivateState, Uint8Array] => [
    privateState,
    privateState.secretKey,
  ],
};

/** The vault declares its signet request index as ledger field 0. */
export const VAULT_REQUESTS_INDEX_FIELD = 0;

/** Swaps register in a separate map (swapEventMap) at field 11, so the swap flow reads
 * MPC responses from this position. Must match the `11 as Uint<8>` the swap circuit passes. */
export const VAULT_SWAP_REQUESTS_INDEX_FIELD = 11;

export { Contract, pureCircuits, ledger };
