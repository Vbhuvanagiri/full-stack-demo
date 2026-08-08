import type { Hex } from 'viem';
import type { BN } from '@coral-xyz/anchor';

export interface StatusCallback {
  (status: {
    status: string;
    txHash?: string;
    note?: string;
    error?: string;
  }): void;
}

export type EvmTransactionRequest = {
  type: number;
  chainId: number;
  nonce: number;
  to: Hex;
  value: bigint;
  data: Hex;
  gasLimit: bigint;
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
};

export type EvmTransactionRequestNotifyWithdrawal = Omit<
  EvmTransactionRequest,
  'value' | 'gasLimit' | 'maxFeePerGas' | 'maxPriorityFeePerGas'
> & {
  value: string;
  gasLimit: string;
  maxFeePerGas: string;
  maxPriorityFeePerGas: string;
};

export interface EvmTransactionProgramParams {
  value: BN;
  gasLimit: BN;
  maxFeePerGas: BN;
  maxPriorityFeePerGas: BN;
  nonce: BN;
  chainId: BN;
}
