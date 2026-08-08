import { BN } from '@coral-xyz/anchor';

import type {
  EvmTransactionRequest,
  EvmTransactionProgramParams,
} from '../types/shared.types';

/**
 * Convert EVM transaction params to the format expected by the Solana program
 */
export function evmParamsToProgram(
  params: Pick<
    EvmTransactionRequest,
    | 'value'
    | 'gasLimit'
    | 'maxFeePerGas'
    | 'maxPriorityFeePerGas'
    | 'nonce'
    | 'chainId'
  >,
): EvmTransactionProgramParams {
  return {
    value: new BN(params.value.toString()),
    gasLimit: new BN(params.gasLimit.toString()),
    maxFeePerGas: new BN(params.maxFeePerGas.toString()),
    maxPriorityFeePerGas: new BN(params.maxPriorityFeePerGas.toString()),
    nonce: new BN(params.nonce.toString()),
    chainId: new BN(params.chainId.toString()),
  };
}
