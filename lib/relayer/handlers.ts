import { BN } from '@coral-xyz/anchor';
import { PublicKey } from '@solana/web3.js';
import { erc20Abi, toBytes, type Hex, type PublicClient } from 'viem';

import type { EvmTransactionRequest } from '@/lib/types/shared.types';
import {
  buildErc20TransferTx,
  serializeEvmTx,
  applyContractSafetyReduction,
} from '@/lib/evm/tx-builder';
import {
  ensureGasForErc20Transfer,
  ensureGasForTransaction,
} from '@/lib/evm/gas-topup';
import { initializeRelayerSetup } from '@/lib/utils/relayer-setup';
import { evmParamsToProgram } from '@/lib/program/utils';
import { generateDepositRequestId } from '@/lib/utils/request-id';
import {
  VAULT_ETHEREUM_ADDRESS,
  deriveVaultAuthorityPda,
  derivePendingDepositPda,
  derivePendingWithdrawalPda,
} from '@/lib/constants/addresses';
import { withEmbeddedSigner } from '@/lib/relayer/embedded-signer';
import { updateTxStatus } from '@/lib/relayer/tx-registry';
import {
  fetchErc20Decimals,
  getErc20Token,
} from '@/lib/constants/token-metadata';
import { TIMEOUTS } from '@/lib/constants/timeouts';
import { RateLimitError, isRateLimitError } from '@/lib/utils/rate-limit';

function extractErrorMessage(error: unknown, context: string): string {
  if (error instanceof RateLimitError) {
    return `Rate limited during ${context}. Use recovery endpoint to retry.`;
  }
  return error instanceof Error
    ? error.message
    : `Unexpected error during ${context}: ${String(error)}`;
}

async function handleFlowResult<
  T extends {
    success: boolean;
    error?: string;
    ethereumTxHash?: string;
    solanaResult?: string;
  },
>(
  result: T,
  trackingId: string,
  flowName: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  if (!result.success) {
    const error =
      result.error ?? `${flowName} failed for request ${trackingId}`;
    await updateTxStatus(trackingId, 'failed', { error });
    return { ok: false, error };
  }
  await updateTxStatus(trackingId, 'completed', {
    ethereumTxHash: result.ethereumTxHash,
    solanaFinalizeTxHash: result.solanaResult,
  });
  return { ok: true };
}

export async function handleDeposit(args: {
  userAddress: string;
  erc20Address: string;
  ethereumAddress: string;
  trackingId: string;
}) {
  return withEmbeddedSigner(() => executeDeposit(args));
}

async function executeDeposit(args: {
  userAddress: string;
  erc20Address: string;
  ethereumAddress: string;
  trackingId: string;
}) {
  const { userAddress, erc20Address, ethereumAddress, trackingId } = args;

  try {
    // Wait 12s for the user's deposit to land on the derived address
    console.log(
      '[DEPOSIT] Waiting 12s for deposit to land on derived address...',
    );
    await new Promise(resolve => setTimeout(resolve, 12000));
    console.log('[DEPOSIT] Initial wait complete, starting deposit flow');

    const { orchestrator, provider, relayerWallet } =
      await initializeRelayerSetup({
        operationName: 'DEPOSIT',
        eventTimeoutMs: TIMEOUTS.MPC_EVENT_WRAPPER,
      });
    const dexContract = orchestrator.getDexContract();

    const userPublicKey = new PublicKey(userAddress);
    const [vaultAuthority] = deriveVaultAuthorityPda(userPublicKey);

    // Phase 1: Balance polling
    await updateTxStatus(trackingId, 'balance_polling');

    const actualAmount = await monitorTokenBalance(
      ethereumAddress,
      erc20Address,
      provider,
    );
    if (!actualAmount) {
      const balanceError = `No token balance detected at ${ethereumAddress} for token ${erc20Address} after 5 minutes`;
      await updateTxStatus(trackingId, 'failed', {
        error: balanceError,
      });
      return { ok: false, error: balanceError };
    }
    console.log(`[DEPOSIT] Token balance detected: ${actualAmount.toString()}`);

    const processAmount = applyContractSafetyReduction(actualAmount);

    // Fetch decimals from chain (throws if token not in allowlist)
    const decimals = await fetchErc20Decimals(erc20Address);
    const tokenMetadata = getErc20Token(erc20Address);

    // Phase 1.5: Gas top-up if needed
    const { topUpTxHash, fees } = await ensureGasForErc20Transfer(
      provider,
      ethereumAddress as Hex,
      erc20Address as Hex,
      VAULT_ETHEREUM_ADDRESS,
      processAmount,
    );
    if (topUpTxHash) {
      console.log(`[DEPOSIT] Gas top-up sent: ${topUpTxHash}`);
      await updateTxStatus(trackingId, 'gas_topup_pending', {
        gasTopUpTxHash: topUpTxHash,
      });
    }

    const path = userAddress;
    const erc20AddressBytes = Array.from(toBytes(erc20Address as Hex));

    const txRequest: EvmTransactionRequest = await buildErc20TransferTx({
      provider,
      from: ethereumAddress,
      erc20Address,
      recipient: VAULT_ETHEREUM_ADDRESS,
      amount: processAmount,
      fees,
    });

    const rlpEncodedTx = serializeEvmTx(txRequest);
    const requestId = generateDepositRequestId(
      vaultAuthority,
      path,
      rlpEncodedTx,
    );

    const requestIdBytes = Array.from(toBytes(requestId as Hex));
    const [pendingDepositPda] = derivePendingDepositPda(requestIdBytes);
    console.log(
      `[DEPOSIT] RequestId: ${requestId}, PDA: ${pendingDepositPda.toBase58()}`,
    );

    const evmParams = evmParamsToProgram(txRequest);
    const amountBN = new BN(processAmount.toString());

    // Phase 2: Solana pending - link requestId and store token info
    await updateTxStatus(trackingId, 'solana_pending', {
      requestId,
      tokenMint: erc20Address,
      tokenAmount: processAmount.toString(),
      tokenDecimals: decimals,
      tokenSymbol: tokenMetadata?.symbol ?? 'Unknown',
    });

    const result = await orchestrator.executeSignatureFlow(
      requestId,
      txRequest,
      async (respondBidirectionalData, ethereumTxHash) => {
        console.log(
          `[DEPOSIT] Attempting to claim. PDA: ${pendingDepositPda.toBase58()}, RequestID: ${requestId}`,
        );
        await updateTxStatus(trackingId, 'completing', { ethereumTxHash });

        const claimTxHash = await dexContract.claimErc20({
          requester: userPublicKey,
          requestIdBytes,
          serializedOutput: respondBidirectionalData.serializedOutput,
          signature: respondBidirectionalData.signature,
          erc20AddressBytes,
        });
        console.log(`[DEPOSIT] Claim successful! Tx: ${claimTxHash}`);
        return claimTxHash;
      },
      async () => {
        const tx = await dexContract.depositErc20({
          requester: userPublicKey,
          payer: relayerWallet.publicKey,
          requestIdBytes,
          erc20AddressBytes,
          recipientAddressBytes: Array.from(
            toBytes(VAULT_ETHEREUM_ADDRESS as Hex),
          ),
          amount: amountBN,
          evmParams,
        });
        await updateTxStatus(trackingId, 'signature_pending', {
          solanaInitTxHash: tx,
        });
        return tx;
      },
      async () => {
        await updateTxStatus(trackingId, 'ethereum_pending');
      },
    );

    const flowResult = await handleFlowResult(
      result,
      trackingId,
      'Deposit flow',
    );
    if (!flowResult.ok) {
      return flowResult;
    }

    return {
      ok: true as const,
      requestId,
      initialSolanaTxHash: result.initialSolanaTxHash,
      ethereumTxHash: result.ethereumTxHash,
      claimTx: result.solanaResult,
    };
  } catch (error) {
    await updateTxStatus(trackingId, 'failed', {
      error: extractErrorMessage(error, 'deposit'),
    });
    throw error;
  }
}

export async function handleWithdrawal(args: {
  requestId: string;
  requester: string;
  erc20Address: string;
  transactionParams: EvmTransactionRequest;
  solanaInitTxHash?: string;
  blockhash?: string;
  lastValidBlockHeight?: number;
}) {
  return withEmbeddedSigner(() => executeWithdrawal(args));
}

async function executeWithdrawal(args: {
  requestId: string;
  requester: string;
  erc20Address: string;
  transactionParams: EvmTransactionRequest;
  solanaInitTxHash?: string;
  blockhash?: string;
  lastValidBlockHeight?: number;
}) {
  const {
    requestId,
    requester,
    erc20Address,
    transactionParams,
    solanaInitTxHash,
    blockhash,
    lastValidBlockHeight,
  } = args;
  const requesterPublicKey = new PublicKey(requester);

  try {
    const { orchestrator, provider } = await initializeRelayerSetup({
      operationName: 'WITHDRAW',
      eventTimeoutMs: TIMEOUTS.MPC_EVENT_WRAPPER,
    });
    const dexContract = orchestrator.getDexContract();

    // Phase: Confirm Solana tx if we have the blockhash info
    if (solanaInitTxHash && blockhash && lastValidBlockHeight) {
      console.log(`[WITHDRAW] Confirming Solana tx: ${solanaInitTxHash}`);
      await updateTxStatus(requestId, 'solana_pending', { solanaInitTxHash });

      await dexContract.confirmTransactionOrThrow(
        solanaInitTxHash,
        blockhash,
        lastValidBlockHeight,
      );
    }

    // Phase: Gas top-up for vault if needed
    const { topUpTxHash } = await ensureGasForTransaction(
      provider,
      VAULT_ETHEREUM_ADDRESS,
      transactionParams.gasLimit,
      transactionParams.maxFeePerGas,
    );
    if (topUpTxHash) {
      console.log(`[WITHDRAW] Gas top-up sent: ${topUpTxHash}`);
      await updateTxStatus(requestId, 'gas_topup_pending', {
        gasTopUpTxHash: topUpTxHash,
      });
    }

    // Update status to signature_pending
    await updateTxStatus(requestId, 'signature_pending');

    const requestIdBytes = Array.from(toBytes(requestId as Hex));
    const [pendingWithdrawalPda] = derivePendingWithdrawalPda(requestIdBytes);
    const erc20AddressBytes = Array.from(toBytes(erc20Address as Hex));

    const result = await orchestrator.executeSignatureFlow(
      requestId,
      transactionParams,
      async (respondBidirectionalData, ethereumTxHash) => {
        console.log(
          `[WITHDRAW] Attempting to complete. PDA: ${pendingWithdrawalPda.toBase58()}, RequestID: ${requestId}`,
        );
        await updateTxStatus(requestId, 'completing', { ethereumTxHash });

        const completeTxHash = await dexContract.completeWithdrawErc20({
          requester: requesterPublicKey,
          requestIdBytes,
          serializedOutput: respondBidirectionalData.serializedOutput,
          signature: respondBidirectionalData.signature,
          erc20AddressBytes,
        });
        console.log(`[WITHDRAW] Complete successful! Tx: ${completeTxHash}`);
        return completeTxHash;
      },
      undefined,
      async () => {
        await updateTxStatus(requestId, 'ethereum_pending');
      },
      solanaInitTxHash,
    );

    const flowResult = await handleFlowResult(
      result,
      requestId,
      'Withdrawal flow',
    );
    if (!flowResult.ok) {
      return flowResult;
    }

    return {
      ok: true as const,
      requestId,
      ethereumTxHash: result.ethereumTxHash,
      solanaTx: result.solanaResult,
    };
  } catch (error) {
    await updateTxStatus(requestId, 'failed', {
      error: extractErrorMessage(error, 'withdrawal'),
    });
    throw error;
  }
}

async function monitorTokenBalance(
  address: string,
  tokenAddress: string,
  client: PublicClient,
): Promise<bigint | null> {
  const config = {
    maxDurationMs: TIMEOUTS.BALANCE_POLLING,
    pollIntervalMs: 5_000,
    backoffMultiplier: 1.2,
    maxIntervalMs: 30_000,
  };

  const confirmationPolls = 2;
  const minimumAmount = 201n;

  let intervalMs = config.pollIntervalMs;
  const deadline = Date.now() + config.maxDurationMs;

  let lastError: Error | null = null;
  let stableBalance: bigint | null = null;
  let stableCount = 0;

  while (Date.now() < deadline) {
    try {
      const balance = await client.readContract({
        address: tokenAddress as Hex,
        abi: erc20Abi,
        functionName: 'balanceOf',
        args: [address as Hex],
      });

      if (balance > 0n) {
        // Check if balance meets minimum threshold
        if (minimumAmount > 0n && balance < minimumAmount) {
          console.log(
            `[BalanceMonitor] Balance ${balance} below minimum ${minimumAmount} for ${address}, continuing to poll...`,
          );
          stableBalance = null;
          stableCount = 0;
        } else if (stableBalance === balance) {
          // Balance matches previous reading, increment stability counter
          stableCount++;
          console.log(
            `[BalanceMonitor] Balance ${balance} confirmed ${stableCount}/${confirmationPolls} times for ${address}`,
          );
          if (stableCount >= confirmationPolls) {
            return balance;
          }
        } else {
          // New balance detected, start stability confirmation
          console.log(
            `[BalanceMonitor] Balance ${balance} detected for ${address}, confirming stability...`,
          );
          stableBalance = balance;
          stableCount = 1;
          if (confirmationPolls <= 1) {
            return balance;
          }
        }
      } else {
        // Balance is zero, reset stability tracking
        stableBalance = null;
        stableCount = 0;
      }
      lastError = null; // Reset on successful read
    } catch (error) {
      // Log once per unique error to help debugging without flooding logs
      const currentError =
        error instanceof Error ? error : new Error(String(error));
      const isRateLimit = isRateLimitError(currentError);

      if (!lastError || lastError.message !== currentError.message) {
        if (isRateLimit) {
          console.warn(
            `[BalanceMonitor] Rate limited for ${address}, will retry on next interval`,
          );
        } else {
          console.warn(
            `[BalanceMonitor] RPC error for ${address}: ${currentError.message}`,
          );
        }
        lastError = currentError;
      }
      // Don't reset stability on RPC error - transient network issues shouldn't discard confirmed balance
    }

    await sleep(intervalMs);
    intervalMs = Math.min(
      intervalMs * config.backoffMultiplier,
      config.maxIntervalMs,
    );
  }

  return null;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
