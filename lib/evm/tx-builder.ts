import {
  encodeFunctionData,
  erc20Abi,
  parseGwei,
  serializeTransaction,
  type Hex,
  type PublicClient,
} from 'viem';

import { SERVICE_CONFIG } from '@/lib/constants/service.config';
import type { EvmTransactionRequest } from '@/lib/types/shared.types';

const FEE_MULTIPLIER = 2n;
const GAS_LIMIT_BUFFER_PERCENT = 120n;
const MIN_PRIORITY_FEE = parseGwei('1');

/**
 * Serialize an EVM transaction request to RLP-encoded bytes (without signature).
 * Used for generating request IDs before signing.
 */
export function serializeEvmTx(txRequest: EvmTransactionRequest): Hex {
  return serializeTransaction({
    chainId: txRequest.chainId,
    nonce: txRequest.nonce,
    maxPriorityFeePerGas: txRequest.maxPriorityFeePerGas,
    maxFeePerGas: txRequest.maxFeePerGas,
    gas: txRequest.gasLimit,
    to: txRequest.to,
    value: txRequest.value,
    data: txRequest.data,
  });
}

/**
 * Apply a random reduction to an amount to work around contract constraints.
 * This is a workaround for edge cases where the full amount causes issues.
 */
export function applyContractSafetyReduction(
  amount: bigint,
  range = 100,
): bigint {
  const reduction = BigInt(Math.floor(Math.random() * range) + 1);
  return amount > reduction ? amount - reduction : amount;
}

export function encodeErc20Transfer(recipient: string, amount: bigint): Hex {
  return encodeFunctionData({
    abi: erc20Abi,
    functionName: 'transfer',
    args: [recipient as Hex, amount],
  });
}

export async function estimateFees(provider: PublicClient): Promise<{
  maxFeePerGas: bigint;
  maxPriorityFeePerGas: bigint;
}> {
  const [block, feeData] = await Promise.all([
    provider.getBlock({ blockTag: 'latest' }),
    provider.estimateFeesPerGas(),
  ]);

  const baseFeePerGas = block.baseFeePerGas ?? parseGwei('30');
  const estimatedPriorityFee = feeData.maxPriorityFeePerGas ?? MIN_PRIORITY_FEE;
  const maxPriorityFeePerGas =
    estimatedPriorityFee > MIN_PRIORITY_FEE
      ? estimatedPriorityFee * FEE_MULTIPLIER
      : MIN_PRIORITY_FEE * FEE_MULTIPLIER;
  const maxFeePerGas = baseFeePerGas * FEE_MULTIPLIER + maxPriorityFeePerGas;

  return { maxFeePerGas, maxPriorityFeePerGas };
}

export async function buildErc20TransferTx(params: {
  provider: PublicClient;
  from: string;
  erc20Address: string;
  recipient: string;
  amount: bigint;
  fees?: { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint };
}): Promise<EvmTransactionRequest> {
  const { provider, from, erc20Address, recipient, amount, fees: precomputedFees } = params;

  const data = encodeErc20Transfer(recipient, amount);

  const [nonce, estimatedGas, fees] = await Promise.all([
    provider.getTransactionCount({ address: from as Hex }),
    provider.estimateGas({
      account: from as Hex,
      to: erc20Address as Hex,
      data,
      value: 0n,
    }),
    precomputedFees ? Promise.resolve(precomputedFees) : estimateFees(provider),
  ]);

  const gasLimit = (estimatedGas * GAS_LIMIT_BUFFER_PERCENT) / 100n;

  return {
    type: 2,
    chainId: SERVICE_CONFIG.ETHEREUM.CHAIN_ID,
    nonce,
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    maxFeePerGas: fees.maxFeePerGas,
    gasLimit,
    to: erc20Address as Hex,
    value: 0n,
    data,
  };
}
