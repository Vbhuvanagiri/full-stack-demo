import {
  type Hex,
  type PublicClient,
  type TransactionReceipt,
  keccak256,
  serializeTransaction,
  BaseError,
} from 'viem';

import type { EvmTransactionRequest } from '@/lib/types/shared.types';
import { TIMEOUTS } from '@/lib/constants/timeouts';

/**
 * Error detection helpers that use viem's structured error types
 * with fallback to normalized string matching for provider compatibility.
 */

// Viem node error name constants
const NONCE_TOO_LOW_ERROR = 'NonceTooLowError';
const WAIT_FOR_RECEIPT_TIMEOUT_ERROR = 'WaitForTransactionReceiptTimeoutError';
const TX_NOT_FOUND_ERROR = 'TransactionNotFoundError';
const TX_RECEIPT_NOT_FOUND_ERROR = 'TransactionReceiptNotFoundError';

// JSON-RPC error codes (EIP-1474)
const RPC_INVALID_INPUT = -32000;
const RPC_TX_REJECTED = -32003;

/**
 * Extracts the error code from an error if it exists.
 * Viem's RpcError and node errors include a code property.
 */
function getErrorCode(error: unknown): number | undefined {
  if (error && typeof error === 'object' && 'code' in error) {
    const code = (error as { code: unknown }).code;
    return typeof code === 'number' ? code : undefined;
  }
  return undefined;
}

/**
 * Extracts the error name from an error.
 * Viem errors have a name property that identifies the error type.
 */
function getErrorName(error: unknown): string | undefined {
  if (error && typeof error === 'object' && 'name' in error) {
    const name = (error as { name: unknown }).name;
    return typeof name === 'string' ? name : undefined;
  }
  return undefined;
}

/**
 * Walks the error chain to find a matching error using viem's BaseError.walk().
 */
function findViemError(
  error: unknown,
  predicate: (err: unknown) => boolean,
): unknown | null {
  if (error instanceof BaseError) {
    return error.walk(predicate);
  }
  return predicate(error) ? error : null;
}

/**
 * Normalizes error to a lowercase string for fallback matching.
 */
function normalizeErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message.toLowerCase();
  }
  return String(error).toLowerCase();
}

/**
 * Detects if the error indicates the nonce was already used.
 * This includes "nonce too low" and "already known" transaction errors.
 *
 * Viem's NonceTooLowError covers: nonce too low, transaction already imported, already known
 */
function isNonceError(error: unknown): boolean {
  // Check viem's structured error name
  const errorName = getErrorName(error);
  if (errorName === NONCE_TOO_LOW_ERROR) {
    return true;
  }

  // Walk the error chain for nested NonceTooLowError
  const foundError = findViemError(
    error,
    (e) => getErrorName(e) === NONCE_TOO_LOW_ERROR,
  );
  if (foundError) {
    return true;
  }

  // Check JSON-RPC error codes that commonly indicate nonce issues
  const code = getErrorCode(error);
  if (code === RPC_INVALID_INPUT || code === RPC_TX_REJECTED) {
    const msg = normalizeErrorMessage(error);
    if (msg.includes('nonce')) {
      return true;
    }
  }

  // Fallback to string matching with multiple variations
  const msg = normalizeErrorMessage(error);
  return (
    msg.includes('nonce too low') ||
    msg.includes('nonce has already been used') ||
    msg.includes('replacement transaction underpriced') ||
    (msg.includes('nonce') && msg.includes('too low'))
  );
}

/**
 * Detects if the error indicates the transaction is already known to the mempool.
 * This is not an error condition - it means we can proceed to wait for the receipt.
 */
function isAlreadyKnownError(error: unknown): boolean {
  // Check viem's structured error - NonceTooLowError includes "already known" pattern
  const errorName = getErrorName(error);
  if (errorName === NONCE_TOO_LOW_ERROR) {
    // Need to distinguish between actual nonce too low vs already known
    const msg = normalizeErrorMessage(error);
    if (
      msg.includes('already known') ||
      msg.includes('already imported') ||
      msg.includes('already in pool')
    ) {
      return true;
    }
  }

  // Walk the error chain
  const foundError = findViemError(error, (e) => {
    const msg = normalizeErrorMessage(e);
    return (
      msg.includes('already known') ||
      msg.includes('already imported') ||
      msg.includes('already in pool')
    );
  });
  if (foundError) {
    return true;
  }

  // Fallback to string matching with multiple variations
  const msg = normalizeErrorMessage(error);
  return (
    msg.includes('already known') ||
    msg.includes('alreadyknown') ||
    msg.includes('already imported') ||
    msg.includes('already in pool') ||
    msg.includes('known transaction') ||
    msg.includes('tx already in mempool')
  );
}

/**
 * Detects if the error indicates the transaction was reverted.
 */
function isRevertedError(error: unknown): boolean {
  const errorName = getErrorName(error);
  if (errorName === 'ExecutionRevertedError') {
    return true;
  }

  const foundError = findViemError(
    error,
    (e) => getErrorName(e) === 'ExecutionRevertedError',
  );
  if (foundError) {
    return true;
  }

  const msg = normalizeErrorMessage(error);
  return msg.includes('reverted') || msg.includes('execution reverted');
}

/**
 * Detects if the error indicates the transaction was not found or timed out.
 * This suggests we should retry broadcasting.
 */
function isNotFoundOrTimeoutError(error: unknown): boolean {
  const errorName = getErrorName(error);
  if (
    errorName === TX_NOT_FOUND_ERROR ||
    errorName === TX_RECEIPT_NOT_FOUND_ERROR ||
    errorName === WAIT_FOR_RECEIPT_TIMEOUT_ERROR
  ) {
    return true;
  }

  // Walk the error chain
  const foundError = findViemError(error, (e) => {
    const name = getErrorName(e);
    return (
      name === TX_NOT_FOUND_ERROR ||
      name === TX_RECEIPT_NOT_FOUND_ERROR ||
      name === WAIT_FOR_RECEIPT_TIMEOUT_ERROR
    );
  });
  if (foundError) {
    return true;
  }

  const msg = normalizeErrorMessage(error);
  return (
    msg.includes('not found') ||
    msg.includes('timeout') ||
    msg.includes('timed out') ||
    msg.includes('could not be found')
  );
}

/**
 * Detects if a rebroadcast error should be ignored.
 * During rebroadcast, "already known" and "nonce too low" errors are acceptable
 * because they indicate the transaction is already in the mempool or mined.
 */
function isRebroadcastErrorIgnorable(error: unknown): boolean {
  return isAlreadyKnownError(error) || isNonceError(error);
}

export interface TxSubmitterConfig {
  maxBroadcastAttempts?: number;
  receiptTimeoutMs?: number;
  pollingIntervalMs?: number;
  confirmations?: number;
}

interface EthereumSignature {
  r: Hex;
  s: Hex;
  v: bigint;
}

interface SubmitResult {
  txHash: Hex;
  receipt: TransactionReceipt;
}

const DEFAULT_CONFIG: Required<TxSubmitterConfig> = {
  maxBroadcastAttempts: 3,
  receiptTimeoutMs: TIMEOUTS.ETHEREUM_RECEIPT,
  pollingIntervalMs: 4_000,
  confirmations: 1,
};

/**
 * Submits an MPC-signed Ethereum transaction and waits for confirmation.
 *
 * NOTE: Gas bumping is NOT possible with MPC signatures because changing
 * gas values invalidates the signature. For better success rates, ensure
 * adequate gas buffer at signing time.
 *
 * Returns only after the receipt is confirmed on-chain.
 */
export async function submitWithRetry(
  client: PublicClient,
  txParams: EvmTransactionRequest,
  signature: EthereumSignature,
  config: TxSubmitterConfig = {},
): Promise<SubmitResult> {
  const cfg = { ...DEFAULT_CONFIG, ...config };

  const signedTx = serializeTransaction(
    {
      chainId: txParams.chainId,
      nonce: txParams.nonce,
      maxPriorityFeePerGas: txParams.maxPriorityFeePerGas,
      maxFeePerGas: txParams.maxFeePerGas,
      gas: txParams.gasLimit,
      to: txParams.to,
      value: txParams.value,
      data: txParams.data,
    },
    {
      r: signature.r,
      s: signature.s,
      yParity: Number(signature.v) - 27,
    },
  );

  const txHash = keccak256(signedTx);
  await broadcastWithRetry(client, signedTx, cfg.maxBroadcastAttempts);

  const receipt = await waitForConfirmedReceipt(client, signedTx, txHash, cfg);

  return { txHash: receipt.transactionHash, receipt };
}

async function broadcastWithRetry(
  client: PublicClient,
  signedTx: Hex,
  maxAttempts: number,
): Promise<void> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      await client.sendRawTransaction({ serializedTransaction: signedTx });
      return;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Transaction already in mempool - not an error, we can proceed
      if (isAlreadyKnownError(error)) {
        return;
      }

      // Nonce already used - transaction may have been mined or replaced
      if (isNonceError(error)) {
        throw new Error(
          `Nonce already used - transaction may have been mined or replaced`,
        );
      }

      if (attempt < maxAttempts) {
        await sleep(2000 * attempt);
      }
    }
  }

  throw new Error(
    `Failed to broadcast after ${maxAttempts} attempts: ${lastError?.message}`,
  );
}

async function waitForConfirmedReceipt(
  client: PublicClient,
  signedTx: Hex,
  txHash: Hex,
  cfg: Required<TxSubmitterConfig>,
): Promise<TransactionReceipt> {
  const startTime = Date.now();

  while (Date.now() - startTime < cfg.receiptTimeoutMs) {
    try {
      const receipt = await client.waitForTransactionReceipt({
        hash: txHash,
        confirmations: cfg.confirmations,
        timeout: Math.min(
          30_000,
          cfg.receiptTimeoutMs - (Date.now() - startTime),
        ),
        pollingInterval: cfg.pollingIntervalMs,
      });

      if (receipt.status === 'reverted') {
        throw new Error(`Transaction reverted: ${txHash}`);
      }

      return receipt;
    } catch (error) {
      // Transaction reverted - don't retry
      if (isRevertedError(error)) {
        throw error;
      }

      // Transaction not found or timeout - try rebroadcasting
      if (isNotFoundOrTimeoutError(error)) {
        try {
          await client.sendRawTransaction({ serializedTransaction: signedTx });
        } catch (rebroadcastError) {
          // Ignore expected rebroadcast errors (already known, nonce used)
          if (!isRebroadcastErrorIgnorable(rebroadcastError)) {
            throw rebroadcastError;
          }
        }
        continue;
      }

      throw error;
    }
  }

  throw new Error(
    `Transaction receipt timeout after ${cfg.receiptTimeoutMs}ms: ${txHash}`,
  );
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
