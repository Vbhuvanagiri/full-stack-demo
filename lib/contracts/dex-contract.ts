import { Buffer } from 'buffer';

import {
  ComputeBudgetProgram,
  Connection,
  PublicKey,
  SYSVAR_INSTRUCTIONS_PUBKEY,
  type TransactionSignature,
} from '@solana/web3.js';
import { Program, AnchorProvider, BN, Wallet } from '@coral-xyz/anchor';
import { toBytes } from 'viem';

import { IDL, type SolanaDexContract } from '@/lib/program/idl-sol-dex';
import type { EvmTransactionProgramParams } from '@/lib/types/shared.types';
import {
  deriveEthereumAddress,
  CHAIN_SIGNATURES_CONFIG,
  deriveVaultAuthorityPda,
  deriveUserBalancePda,
  derivePendingDepositPda,
  derivePendingWithdrawalPda,
} from '@/lib/constants/addresses';
import { isRateLimitError, wrapRateLimitError } from '@/lib/utils/rate-limit';

import type { RSVSignature } from 'signet.js';

export { RateLimitError } from '@/lib/utils/rate-limit';

const COMPUTE_UNITS_FOR_DERIVATION = 400_000;
const PRIORITY_FEE_MICRO_LAMPORTS = 50_000;

export class DexContract {
  private program: Program<SolanaDexContract> | null = null;

  constructor(
    private connection: Connection,
    private wallet: Wallet,
  ) {}

  getConnection(): Connection {
    return this.connection;
  }

  getWallet(): Wallet {
    return this.wallet;
  }

  private getDexProgram(): Program<SolanaDexContract> {
    if (!this.program) {
      const provider = new AnchorProvider(this.connection, this.wallet, {
        commitment: 'confirmed',
        skipPreflight: true,
      });
      this.program = new Program(IDL, provider);
    }
    return this.program;
  }

  async fetchUserBalance(
    userPublicKey: PublicKey,
    erc20Address: string,
  ): Promise<string> {
    try {
      const erc20Bytes = Buffer.from(toBytes(erc20Address as `0x${string}`));
      const [userBalancePda] = deriveUserBalancePda(userPublicKey, erc20Bytes);
      const program = this.getDexProgram();

      const userBalanceAccount =
        await program.account.userErc20Balance.fetchNullable(userBalancePda);

      if (!userBalanceAccount) {
        return '0';
      }

      return userBalanceAccount.amount.toString();
    } catch (error) {
      if (
        error instanceof Error &&
        (error.message.includes('Account does not exist') ||
          error.message.includes('AccountNotFound'))
      ) {
        return '0';
      }
      throw new Error(
        `Failed to fetch user balance: ${error instanceof Error ? error.message : 'Unknown error'}`,
      );
    }
  }

  async depositErc20({
    requester,
    payer,
    requestIdBytes,
    erc20AddressBytes,
    recipientAddressBytes,
    amount,
    evmParams,
  }: {
    requester: PublicKey;
    payer?: PublicKey;
    requestIdBytes: number[];
    erc20AddressBytes: number[];
    recipientAddressBytes: number[];
    amount: BN;
    evmParams: EvmTransactionProgramParams;
  }): Promise<string> {
    const payerKey = payer || this.wallet.publicKey;
    const program = this.getDexProgram();

    let blockhash: string;
    let lastValidBlockHeight: number;
    try {
      const result = await this.connection.getLatestBlockhash('confirmed');
      blockhash = result.blockhash;
      lastValidBlockHeight = result.lastValidBlockHeight;
    } catch (error) {
      wrapRateLimitError(error, 'depositErc20.getLatestBlockhash', 'DexContract');
    }

    const [pendingDepositPda] = derivePendingDepositPda(requestIdBytes);

    let signature: string;
    try {
      signature = await program.methods
        .depositErc20(
          requestIdBytes as unknown as number[],
          requester,
          erc20AddressBytes as unknown as number[],
          recipientAddressBytes as unknown as number[],
          amount,
          evmParams,
        )
        .accountsPartial({
          payer: payerKey,
          pendingDeposit: pendingDepositPda,
          feePayer: payerKey,
          instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
        })
        .preInstructions([
          ComputeBudgetProgram.setComputeUnitLimit({
            units: COMPUTE_UNITS_FOR_DERIVATION,
          }),
          ComputeBudgetProgram.setComputeUnitPrice({
            microLamports: PRIORITY_FEE_MICRO_LAMPORTS,
          }),
        ])
        .rpc();
    } catch (error) {
      wrapRateLimitError(error, 'depositErc20.rpc', 'DexContract');
    }

    await this.confirmTransactionOrThrow(signature, blockhash, lastValidBlockHeight);

    return signature;
  }

  async claimErc20({
    requestIdBytes,
    serializedOutput,
    signature,
    erc20AddressBytes,
    requester,
  }: {
    requestIdBytes: number[];
    serializedOutput: Buffer | number[];
    signature: RSVSignature;
    erc20AddressBytes: number[];
    requester: PublicKey;
  }): Promise<string> {
    const erc20Bytes = Buffer.from(erc20AddressBytes);
    const [userBalancePda] = deriveUserBalancePda(requester, erc20Bytes);
    const program = this.getDexProgram();

    try {
      return await program.methods
        .claimErc20(
          Array.from(requestIdBytes) as unknown as number[],
          Buffer.from(serializedOutput),
          signature,
        )
        .accounts({
          userBalance: userBalancePda,
        })
        .preInstructions([
          ComputeBudgetProgram.setComputeUnitLimit({
            units: COMPUTE_UNITS_FOR_DERIVATION,
          }),
        ])
        .rpc();
    } catch (error) {
      wrapRateLimitError(error, 'claimErc20.rpc', 'DexContract');
    }
  }

  async withdrawErc20({
    authority,
    requestIdBytes,
    erc20AddressBytes,
    amount,
    recipientAddressBytes,
    evmParams,
  }: {
    authority: PublicKey;
    requestIdBytes: number[];
    erc20AddressBytes: number[];
    amount: BN;
    recipientAddressBytes: number[];
    evmParams: EvmTransactionProgramParams;
  }): Promise<{
    signature: string;
    blockhash: string;
    lastValidBlockHeight: number;
  }> {
    const program = this.getDexProgram();
    const [pendingWithdrawalPda] = derivePendingWithdrawalPda(requestIdBytes);

    const tx = await program.methods
      .withdrawErc20(
        Array.from(requestIdBytes) as unknown as number[],
        Array.from(erc20AddressBytes) as unknown as number[],
        amount,
        Array.from(recipientAddressBytes) as unknown as number[],
        evmParams,
      )
      .accountsPartial({
        authority,
        pendingWithdrawal: pendingWithdrawalPda,
        feePayer: authority,
        instructions: SYSVAR_INSTRUCTIONS_PUBKEY,
      })
      .preInstructions([
        ComputeBudgetProgram.setComputeUnitLimit({
          units: COMPUTE_UNITS_FOR_DERIVATION,
        }),
        ComputeBudgetProgram.setComputeUnitPrice({
          microLamports: PRIORITY_FEE_MICRO_LAMPORTS,
        }),
      ])
      .transaction();

    tx.feePayer = authority;

    let blockhash: string;
    let lastValidBlockHeight: number;
    try {
      const result = await this.connection.getLatestBlockhash('confirmed');
      blockhash = result.blockhash;
      lastValidBlockHeight = result.lastValidBlockHeight;
    } catch (error) {
      wrapRateLimitError(error, 'withdrawErc20.getLatestBlockhash', 'DexContract');
    }
    tx.recentBlockhash = blockhash;

    const signedTx = await this.wallet.signTransaction(tx);

    let signature: string;
    try {
      signature = await this.connection.sendRawTransaction(
        signedTx.serialize(),
        { skipPreflight: true },
      );
    } catch (error) {
      wrapRateLimitError(error, 'withdrawErc20.sendRawTransaction', 'DexContract');
    }

    return { signature, blockhash, lastValidBlockHeight };
  }

  async completeWithdrawErc20({
    requestIdBytes,
    serializedOutput,
    signature,
    erc20AddressBytes,
    requester,
  }: {
    requestIdBytes: number[];
    serializedOutput: Buffer | number[];
    signature: RSVSignature;
    erc20AddressBytes: number[];
    requester: PublicKey;
  }): Promise<string> {
    const erc20Bytes = Buffer.from(erc20AddressBytes);
    const [userBalancePda] = deriveUserBalancePda(requester, erc20Bytes);
    const program = this.getDexProgram();

    try {
      return await program.methods
        .completeWithdrawErc20(
          Array.from(requestIdBytes) as unknown as number[],
          Buffer.from(serializedOutput),
          signature,
        )
        .accounts({
          userBalance: userBalancePda,
        })
        .preInstructions([
          ComputeBudgetProgram.setComputeUnitLimit({
            units: COMPUTE_UNITS_FOR_DERIVATION,
          }),
        ])
        .rpc();
    } catch (error) {
      wrapRateLimitError(error, 'completeWithdrawErc20.rpc', 'DexContract');
    }
  }

  deriveDepositAddress(publicKey: PublicKey): string {
    const [vaultAuthority] = deriveVaultAuthorityPda(publicKey);
    const path = publicKey.toString();
    return deriveEthereumAddress(
      path,
      vaultAuthority.toString(),
      CHAIN_SIGNATURES_CONFIG.MPC_ROOT_PUBLIC_KEY,
    );
  }

  /**
   * Confirms a transaction with proper handling of blockhash expiration.
   * When blockhash expires, checks status once - if not landed, it never will.
   * Rate limit errors (429) are detected and wrapped for graceful handling.
   */
  async confirmTransactionOrThrow(
    signature: TransactionSignature,
    blockhash: string,
    lastValidBlockHeight: number,
  ): Promise<void> {
    try {
      const result = await this.connection.confirmTransaction(
        { signature, blockhash, lastValidBlockHeight },
        'confirmed',
      );

      if (result.value.err) {
        throw new Error(`Transaction failed: ${JSON.stringify(result.value.err)}`);
      }
    } catch (error) {
      // Check for rate limit first - fail fast for later recovery
      if (isRateLimitError(error)) {
        wrapRateLimitError(error, 'confirmTransaction', 'DexContract');
      }

      const errorMessage = error instanceof Error ? error.message : String(error);

      // Blockhash expired - check final status once
      if (
        errorMessage.includes('block height exceeded') ||
        errorMessage.includes('expired')
      ) {
        let response;
        try {
          response = await this.connection.getSignatureStatuses([signature]);
        } catch (statusError) {
          wrapRateLimitError(statusError, 'getSignatureStatuses', 'DexContract');
        }
        const status = response.value[0];

        if (status) {
          if (status.err) {
            throw new Error(`Transaction failed: ${JSON.stringify(status.err)}`);
          }

          if (
            status.confirmationStatus === 'confirmed' ||
            status.confirmationStatus === 'finalized'
          ) {
            return;
          }
        }

        throw new Error(
          `Transaction not confirmed: blockhash expired and transaction not found. Signature: ${signature}`,
        );
      }

      throw error;
    }
  }
}
