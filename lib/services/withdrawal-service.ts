import { Connection, PublicKey, Transaction } from '@solana/web3.js';
import {
  createAssociatedTokenAccountInstruction,
  createTransferInstruction,
  getAssociatedTokenAddress,
  getAccount,
  TokenAccountNotFoundError,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
} from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';
import { isAddress, getAddress, parseUnits, formatUnits, toBytes, type Hex } from 'viem';

import type {
  EvmTransactionRequest,
  StatusCallback,
} from '@/lib/types/shared.types';
import { fetchErc20Decimals, getErc20Token } from '@/lib/constants/token-metadata';
import {
  buildErc20TransferTx,
  serializeEvmTx,
  applyContractSafetyReduction,
} from '@/lib/evm/tx-builder';
import { evmParamsToProgram } from '@/lib/program/utils';
import { generateWithdrawalRequestId } from '@/lib/utils/request-id';
import { DexContract } from '@/lib/contracts/dex-contract';
import { wrapRateLimitError } from '@/lib/utils/rate-limit';
import { notifyWithdrawal } from '@/lib/services/relayer-service';
import { withRetry } from '@/lib/utils/retry';
import {
  VAULT_ETHEREUM_ADDRESS,
  GLOBAL_VAULT_AUTHORITY_PDA,
} from '@/lib/constants/addresses';
import { getEthereumProvider } from '@/lib/rpc';

/**
 * WithdrawalService handles ERC20 withdrawal initiation.
 * The relayer handles withdrawal completion automatically.
 */
export class WithdrawalService {
  constructor(private dexContract: DexContract) {}

  /**
   * Perform a direct SPL token transfer on Solana.
   */
  async withdrawSol(
    publicKey: PublicKey,
    mintAddress: string,
    amount: string,
    recipientAddress: string,
    decimals: number,
    onStatusChange?: StatusCallback,
  ): Promise<string> {
    // Validate Solana addresses before using them
    let mint: PublicKey;
    let recipientPubkey: PublicKey;

    try {
      mint = new PublicKey(mintAddress);
    } catch {
      throw new Error(
        `Invalid Solana address format for mint: "${mintAddress}"`,
      );
    }

    try {
      recipientPubkey = new PublicKey(recipientAddress);
    } catch {
      throw new Error(
        `Invalid Solana address format for recipient: "${recipientAddress}"`,
      );
    }

    try {
      const connection: Connection = this.dexContract.getConnection();
      const wallet = this.dexContract.getWallet();
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error('Wallet not available for SPL transfer');
      }

      const senderAta = await getAssociatedTokenAddress(
        mint,
        publicKey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );
      const recipientAta = await getAssociatedTokenAddress(
        mint,
        recipientPubkey,
        false,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID,
      );

      const amountInUnits = parseUnits(amount, decimals);

      // Pre-flight balance check for UX improvement
      let senderTokenAccount;
      try {
        senderTokenAccount = await getAccount(connection, senderAta);
      } catch (error) {
        if (error instanceof TokenAccountNotFoundError) {
          throw new Error(
            `Insufficient balance: you have 0 but requested ${amount}`,
          );
        }
        wrapRateLimitError(error, 'getAccount', 'WithdrawalService');
      }
      const currentBalance = senderTokenAccount.amount;
      if (currentBalance < amountInUnits) {
        const formattedBalance = formatUnits(currentBalance, decimals);
        throw new Error(
          `Insufficient balance: you have ${formattedBalance} but requested ${amount}`,
        );
      }

      const instructions = [] as Array<Parameters<Transaction['add']>[0]>;

      let recipientAtaInfo;
      try {
        recipientAtaInfo = await connection.getAccountInfo(recipientAta);
      } catch (error) {
        wrapRateLimitError(error, 'getAccountInfo', 'WithdrawalService');
      }
      if (!recipientAtaInfo) {
        instructions.push(
          createAssociatedTokenAccountInstruction(
            publicKey,
            recipientAta,
            recipientPubkey,
            mint,
            TOKEN_PROGRAM_ID,
            ASSOCIATED_TOKEN_PROGRAM_ID,
          ),
        );
      }

      instructions.push(
        createTransferInstruction(
          senderAta,
          recipientAta,
          publicKey,
          amountInUnits,
          [],
          TOKEN_PROGRAM_ID,
        ),
      );

      const tx = new Transaction().add(...instructions);
      tx.feePayer = publicKey;
      let blockhashResult;
      try {
        blockhashResult = await connection.getLatestBlockhash();
      } catch (error) {
        wrapRateLimitError(error, 'getLatestBlockhash', 'WithdrawalService');
      }
      tx.recentBlockhash = blockhashResult.blockhash;

      const signed = await wallet.signTransaction(tx);
      let sig;
      try {
        sig = await connection.sendRawTransaction(signed.serialize());
      } catch (error) {
        wrapRateLimitError(error, 'sendRawTransaction', 'WithdrawalService');
      }

      onStatusChange?.({
        status: 'completed',
        txHash: sig,
        note: 'SPL transfer submitted',
      });

      return sig;
    } catch (error) {
      throw new Error(
        `Failed to initiate Solana withdrawal: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  /**
   * Initiate an ERC20 withdrawal via the cross-chain bridge and relayer.
   */
  async withdrawEvm(
    publicKey: PublicKey,
    erc20Address: string,
    amount: string,
    recipientAddress: string,
    onStatusChange?: StatusCallback,
  ): Promise<string> {
    try {
      const globalVaultAuthority = GLOBAL_VAULT_AUTHORITY_PDA;

      // Fetch decimals from chain (throws if token not in allowlist)
      const decimals = await fetchErc20Decimals(erc20Address);
      const tokenMetadata = getErc20Token(erc20Address);

      const amountBigInt = parseUnits(amount, decimals);

      const userBalanceRaw = await this.dexContract.fetchUserBalance(publicKey, erc20Address);
      const userBalanceBigInt = BigInt(userBalanceRaw);
      if (userBalanceBigInt < amountBigInt) {
        const formattedBalance = formatUnits(userBalanceBigInt, decimals);
        throw new Error(
          `Insufficient balance: you have ${formattedBalance} but requested ${amount}`,
        );
      }

      const processAmountBigInt = applyContractSafetyReduction(amountBigInt);

      const amountBN = new BN(processAmountBigInt.toString());
      const erc20AddressBytes = Array.from(toBytes(erc20Address as Hex));

      if (!isAddress(recipientAddress)) {
        throw new Error('Invalid Ethereum address format');
      }

      const checksummedAddress = getAddress(recipientAddress);
      const recipientAddressBytes = Array.from(toBytes(checksummedAddress));

      const txRequest: EvmTransactionRequest = await buildErc20TransferTx({
        provider: getEthereumProvider(),
        from: VAULT_ETHEREUM_ADDRESS,
        erc20Address,
        recipient: checksummedAddress,
        amount: processAmountBigInt,
      });

      const evmParams = evmParamsToProgram(txRequest);
      const rlpEncodedTx = serializeEvmTx(txRequest);

      const requestId = generateWithdrawalRequestId(globalVaultAuthority, rlpEncodedTx);

      const requestIdBytes = Array.from(toBytes(requestId as Hex));

      console.log(`[WITHDRAW] Starting withdrawal, requestId: ${requestId}`);

      onStatusChange?.({
        status: 'preparing',
        note: 'Submitting withdrawal to Solana...',
      });

      // Submit Solana transaction - returns immediately after wallet signs
      // Confirmation happens in the background handler
      let solanaInitTxHash: string | undefined;
      let blockhash: string | undefined;
      let lastValidBlockHeight: number | undefined;

      try {
        console.log('[WITHDRAW] Calling withdrawErc20...');
        const result = await this.dexContract.withdrawErc20({
          authority: publicKey,
          requestIdBytes,
          erc20AddressBytes,
          amount: amountBN,
          recipientAddressBytes,
          evmParams,
        });
        solanaInitTxHash = result.signature;
        blockhash = result.blockhash;
        lastValidBlockHeight = result.lastValidBlockHeight;
        console.log(`[WITHDRAW] withdrawErc20 returned: ${solanaInitTxHash}`);
      } catch (txError) {
        const originalError =
          txError &&
          typeof txError === 'object' &&
          'originalError' in txError &&
          txError.originalError instanceof Error
            ? txError.originalError
            : null;
        console.error('[WITHDRAW] Solana tx error:', txError);
        console.error('[WITHDRAW] Original error:', originalError);

        const errorMessage =
          txError instanceof Error ? txError.message : String(txError);
        const originalMessage = originalError?.message ?? '';
        const fullMessage = `${errorMessage}${originalMessage ? `: ${originalMessage}` : ''}`;
        console.error('[WITHDRAW] Full error message:', fullMessage);

        if (
          fullMessage.includes('already been processed') ||
          fullMessage.includes('AlreadyProcessed')
        ) {
          console.log('[WITHDRAW] Transaction already processed, continuing...');
        } else {
          console.error('[WITHDRAW] Throwing error, notifyWithdrawal will NOT be called');
          throw originalError ?? txError;
        }
      }

      // Notify the relayer immediately - it will confirm the tx in the background
      console.log('[WITHDRAW] Notifying relayer (tx confirmation will happen in background)...');
      try {
        await withRetry(
          () =>
            notifyWithdrawal({
              requestId,
              erc20Address,
              userAddress: publicKey.toBase58(),
              recipientAddress: checksummedAddress,
              transactionParams: {
                ...txRequest,
                maxPriorityFeePerGas: txRequest.maxPriorityFeePerGas.toString(),
                maxFeePerGas: txRequest.maxFeePerGas.toString(),
                gasLimit: txRequest.gasLimit.toString(),
                value: txRequest.value.toString(),
              },
              tokenAmount: processAmountBigInt.toString(),
              tokenDecimals: decimals,
              tokenSymbol: tokenMetadata?.symbol ?? 'Unknown',
              solanaInitTxHash,
              blockhash,
              lastValidBlockHeight,
            }),
          {
            maxRetries: 3,
            baseDelayMs: 1000,
            context: 'WITHDRAW notifyWithdrawal',
          },
        );
        console.log('[WITHDRAW] Relayer notified');
      } catch (notifyError) {
        console.error(
          '[WITHDRAW] Failed to notify relayer after 3 retries:',
          notifyError instanceof Error ? notifyError.message : notifyError,
        );
        onStatusChange?.({
          status: 'failed',
          note: `Withdrawal initiated on Solana (requestId: ${requestId}) but failed to notify relayer. Please use recovery to complete the withdrawal.`,
        });
        throw new Error(
          `Relayer notification failed after retries. Withdrawal requestId: ${requestId}. Use recovery to complete.`,
        );
      }

      onStatusChange?.({
        status: 'relayer_processing',
        note: 'Withdrawal initiated. Relayer will complete the process.',
      });

      return requestId;
    } catch (error) {
      throw new Error(
        `Failed to initiate EVM withdrawal: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

}
