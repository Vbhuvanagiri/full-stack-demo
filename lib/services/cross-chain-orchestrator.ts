import { Connection, PublicKey } from '@solana/web3.js';
import {
  AnchorProvider,
  Wallet,
  utils as anchorUtils,
} from '@coral-xyz/anchor';
import { type Hex, type PublicClient } from 'viem';
import { contracts, type RSVSignature } from 'signet.js';

import { DexContract } from '@/lib/contracts/dex-contract';
import type {
  EventListenerResult,
  RespondBidirectionalData,
} from '@/lib/types/chain-signatures.types';
import type { EvmTransactionRequest } from '@/lib/types/shared.types';
import { submitWithRetry } from '@/lib/evm/tx-submitter';
import { TIMEOUTS } from '@/lib/constants/timeouts';
import { getClientEnv } from '@/lib/config/env.config';
import {
  RESPONDER_ADDRESS,
  CHAIN_SIGNATURES_PROGRAM_ID,
} from '@/lib/constants/addresses';

const env = getClientEnv();

export interface CrossChainConfig {
  eventTimeoutMs?: number;
  ethereumConfirmations?: number;
  operationName?: string;
  initialDelayMs?: number;
}

export interface CrossChainResult {
  ethereumTxHash: string;
  success: boolean;
  error?: string;
}

function getRootPublicKeyForSignet(): `secp256k1:${string}` {
  const rootPublicKey = env.NEXT_PUBLIC_MPC_ROOT_PUBLIC_KEY;
  const rootPublicKeyUncompressed = Array.from(
    Buffer.from(rootPublicKey.slice(2), 'hex'),
  );
  const publicKeyBytes = rootPublicKeyUncompressed.slice(1);
  const base58PublicKey = anchorUtils.bytes.bs58.encode(publicKeyBytes);
  return `secp256k1:${base58PublicKey}`;
}

export class CrossChainOrchestrator {
  private dexContract: DexContract;
  private eventConnection: Connection;
  private wallet: Wallet;
  private client: PublicClient;
  private config: Required<CrossChainConfig>;

  constructor(
    connection: Connection,
    wallet: Wallet,
    client: PublicClient,
    config: CrossChainConfig = {},
    eventConnection?: Connection,
  ) {
    this.dexContract = new DexContract(connection, wallet);
    this.eventConnection = eventConnection || connection;
    this.wallet = wallet;
    this.client = client;

    this.config = {
      // When eventTimeoutMs <= 0, we will wait indefinitely for events
      eventTimeoutMs: config.eventTimeoutMs ?? TIMEOUTS.MPC_EVENT_WRAPPER,
      ethereumConfirmations: config.ethereumConfirmations ?? 1,
      operationName: config.operationName ?? 'OPERATION',
      initialDelayMs: config.initialDelayMs ?? 0,
    };
  }

  private async setupEventListeners(
    requestId: string,
    afterSignature?: string,
  ): Promise<EventListenerResult> {
    const provider = new AnchorProvider(this.eventConnection, this.wallet, {
      commitment: 'confirmed',
    });

    const signetContract = new contracts.solana.ChainSignatureContract({
      provider,
      programId: CHAIN_SIGNATURES_PROGRAM_ID,
      config: {
        rootPublicKey: getRootPublicKeyForSignet(),
      },
    });

    const controller = new AbortController();

    // signet.js type declarations don't match runtime behavior for these events.
    // At runtime, the library returns RSVSignature-compatible objects.
    const signature = signetContract.waitForEvent({
      eventName: 'signatureRespondedEvent',
      requestId,
      signer: new PublicKey(RESPONDER_ADDRESS),
      afterSignature,
      timeoutMs: TIMEOUTS.MPC_EVENT_LISTENER,
      signal: controller.signal,
    }) as unknown as Promise<RSVSignature>;

    const respondBidirectional = signetContract.waitForEvent({
      eventName: 'respondBidirectionalEvent',
      requestId,
      signer: new PublicKey(RESPONDER_ADDRESS),
      afterSignature,
      timeoutMs: TIMEOUTS.MPC_EVENT_LISTENER,
      signal: controller.signal,
    }) as unknown as Promise<RespondBidirectionalData>;

    return {
      signature,
      respondBidirectional,
      cleanup: () => controller.abort(),
    };
  }

  async executeSignatureFlow<T>(
    requestId: string,
    ethereumTxParams: EvmTransactionRequest,
    solanaCompletionFn: (
      respondBidirectionalData: RespondBidirectionalData,
      ethereumTxHash?: string,
    ) => Promise<T>,
    initialSolanaFn?: () => Promise<string>,
    onEthereumPending?: () => Promise<void>,
    afterSignature?: string,
  ): Promise<
    CrossChainResult & { initialSolanaTxHash?: string; solanaResult?: T }
  > {
    const op = this.config.operationName;
    console.log(`[${op}] Starting signature flow for ${requestId}`);

    try {
      // Optional initial delay (e.g., for deposits to land on derived address)
      if (this.config.initialDelayMs > 0) {
        console.log(
          `[${op}] Waiting ${this.config.initialDelayMs}ms before starting flow...`,
        );
        await new Promise(resolve =>
          setTimeout(resolve, this.config.initialDelayMs),
        );
      }

      // Phase 1: Execute initial Solana transaction if provided (triggers signature generation)
      let initialSolanaTxHash: string | undefined;
      if (initialSolanaFn) {
        console.log(`[${op}] Executing initial Solana transaction...`);
        initialSolanaTxHash = await initialSolanaFn();
        console.log(`[${op}] Initial Solana tx: ${initialSolanaTxHash}`);
      }

      // Set up event listeners AFTER initial tx, using the tx hash as cursor.
      // waitForEvent's backfill mechanism catches any events emitted in the gap.
      const cursorSignature = initialSolanaTxHash ?? afterSignature;
      console.log(`[${op}] Setting up event listeners...`);
      const eventListeners = await this.setupEventListeners(
        requestId,
        cursorSignature,
      );

      try {
        // Phase 2: Wait for signature and submit to Ethereum
        const ethereumTxHash = await this.executeEthereumTransaction(
          eventListeners,
          ethereumTxParams,
          onEthereumPending,
        );

        console.log(`[${op}] Ethereum tx: ${ethereumTxHash}`);

        // Phase 3: Wait for read response and complete on Solana
        console.log(`[${op}] Waiting for read response...`);
        const respondBidirectionalData =
          await this.waitForRespondBidirectional(eventListeners);

        console.log(`[${op}] Completing on Solana...`);
        const solanaResult = await solanaCompletionFn(
          respondBidirectionalData,
          ethereumTxHash,
        );

        console.log(`[${op}] Flow completed successfully`);

        return {
          ethereumTxHash,
          initialSolanaTxHash,
          success: true,
          solanaResult,
        };
      } catch (error) {
        console.error(error);
        if (error && typeof error === 'object' && 'logs' in error) {
          console.error(
            `[${op}] Transaction logs:`,
            (error as { logs: string[] }).logs,
          );
        }
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Unexpected error in signature flow for ${requestId}: ${String(error)}`;
        console.error(`[${op}] Flow failed:`, errorMessage);

        return {
          ethereumTxHash: '',
          success: false,
          error: errorMessage,
        };
      } finally {
        console.log(`[${op}] Cleaning up event listeners`);
        eventListeners.cleanup();
      }
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Unexpected error in signature flow for ${requestId}: ${String(error)}`;
      console.error(`[${op}] Flow failed:`, errorMessage);

      return {
        ethereumTxHash: '',
        success: false,
        error: errorMessage,
      };
    }
  }

  private async executeEthereumTransaction(
    eventListeners: EventListenerResult,
    txParams: EvmTransactionRequest,
    onEthereumPending?: () => Promise<void>,
  ): Promise<string> {
    const op = this.config.operationName;
    console.log(`[${op}] Waiting for signature...`);

    const signatureResult = await this.waitWithTimeout(
      eventListeners.signature,
      this.config.eventTimeoutMs,
      `Signature event timeout for ${op}`,
    );

    console.log(`[${op}] Signature received`);

    console.log(`[${op}] Submitting to Ethereum...`);

    // Notify that we're about to submit to Ethereum
    if (onEthereumPending) {
      await onEthereumPending();
    }

    const { txHash, receipt } = await submitWithRetry(
      this.client,
      txParams,
      {
        r: `0x${signatureResult.r}` as Hex,
        s: `0x${signatureResult.s}` as Hex,
        v: BigInt(signatureResult.v),
      },
      {
        maxBroadcastAttempts: 3,
        receiptTimeoutMs: TIMEOUTS.ETHEREUM_RECEIPT,
      },
    );

    console.log(`[${op}] Receipt received:`, {
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed?.toString(),
    });

    return txHash;
  }

  private async waitForRespondBidirectional(
    eventListeners: EventListenerResult,
  ): Promise<RespondBidirectionalData> {
    const op = this.config.operationName;

    return await this.waitWithTimeout(
      eventListeners.respondBidirectional,
      this.config.eventTimeoutMs,
      `Read response timeout for ${op}`,
    );
  }

  private async waitWithTimeout<T>(
    promise: Promise<T>,
    timeoutMs: number,
    errorMessage: string,
  ): Promise<T> {
    let timeoutId: NodeJS.Timeout;
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
    });

    try {
      return await Promise.race([promise, timeoutPromise]);
    } finally {
      clearTimeout(timeoutId!);
    }
  }

  getDexContract(): DexContract {
    return this.dexContract;
  }
}
