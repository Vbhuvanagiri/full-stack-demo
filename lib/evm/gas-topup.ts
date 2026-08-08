import {
  createWalletClient,
  http,
  parseEther,
  type Hex,
  type PublicClient,
} from 'viem';
import { sepolia } from 'viem/chains';

import { getEthSepoliaRpcUrl } from '@/lib/rpc';
import { encodeErc20Transfer, estimateFees } from '@/lib/evm/tx-builder';
import { getRelayerEthAccount } from '@/lib/utils/relayer-setup';

const GAS_BUFFER_MULTIPLIER = 1.5;
// Per-call cap on a single top-up. Must cover the largest single vault tx's upfront reservation:
// the swap's 700k gas * 30 gwei = 0.021 ETH (plus the route's fee margin + buffer). The old 0.01
// cap silently under-funded the swap after its gas envelope was raised.
const MAX_TOPUP_ETH = parseEther('0.05');
const GAS_LIMIT_BUFFER_PERCENT = 120n;
const ETH_TRANSFER_GAS = 21000n;

async function sendGasTopUp(
  client: PublicClient,
  recipientAddress: Hex,
  deficit: bigint,
): Promise<{ txHash: Hex; amount: bigint }> {
  const topUpAmount = calculateTopUpAmount(deficit);
  const account = getRelayerEthAccount();

  const relayerBalance = await client.getBalance({ address: account.address });
  if (relayerBalance < topUpAmount) {
    throw new Error(
      `Relayer funding wallet has insufficient ETH. ` +
        `Has: ${relayerBalance}, needs: ${topUpAmount}. ` +
        `Please fund address: ${account.address}`,
    );
  }

  const [nonce, fees] = await Promise.all([
    client.getTransactionCount({ address: account.address }),
    estimateFees(client),
  ]);

  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(getEthSepoliaRpcUrl()),
  });

  const txHash = await walletClient.sendTransaction({
    to: recipientAddress,
    value: topUpAmount,
    nonce,
    maxFeePerGas: fees.maxFeePerGas,
    maxPriorityFeePerGas: fees.maxPriorityFeePerGas,
    gas: ETH_TRANSFER_GAS,
  });

  await client.waitForTransactionReceipt({
    hash: txHash,
    confirmations: 1,
    timeout: 60_000,
  });

  return { txHash, amount: topUpAmount };
}

function calculateTopUpAmount(deficit: bigint): bigint {
  const withBuffer = BigInt(
    Math.ceil(Number(deficit) * GAS_BUFFER_MULTIPLIER),
  );
  return withBuffer > MAX_TOPUP_ETH ? MAX_TOPUP_ETH : withBuffer;
}

async function checkAndTopUp(
  client: PublicClient,
  targetAddress: Hex,
  gasLimit: bigint,
  maxFeePerGas: bigint,
): Promise<{ topUpTxHash: Hex | null; topUpAmount: bigint }> {
  const totalCost = gasLimit * maxFeePerGas;
  const balance = await client.getBalance({ address: targetAddress });

  if (balance >= totalCost) {
    return { topUpTxHash: null, topUpAmount: 0n };
  }

  const deficit = totalCost - balance;
  const { txHash, amount } = await sendGasTopUp(client, targetAddress, deficit);
  return { topUpTxHash: txHash, topUpAmount: amount };
}

export async function ensureGasForErc20Transfer(
  client: PublicClient,
  targetAddress: Hex,
  erc20Address: Hex,
  recipient: Hex,
  amount: bigint,
): Promise<{
  topUpTxHash: Hex | null;
  topUpAmount: bigint;
  fees: { maxFeePerGas: bigint; maxPriorityFeePerGas: bigint };
}> {
  const data = encodeErc20Transfer(recipient, amount);

  const [estimatedGas, fees] = await Promise.all([
    client.estimateGas({
      account: targetAddress,
      to: erc20Address,
      data,
      value: 0n,
    }),
    estimateFees(client),
  ]);

  const gasLimit = (estimatedGas * GAS_LIMIT_BUFFER_PERCENT) / 100n;
  const topUpResult = await checkAndTopUp(client, targetAddress, gasLimit, fees.maxFeePerGas);
  return { ...topUpResult, fees };
}

export async function ensureGasForTransaction(
  client: PublicClient,
  fromAddress: Hex,
  gasLimit: bigint,
  maxFeePerGas: bigint,
): Promise<{ topUpTxHash: Hex | null; topUpAmount: bigint }> {
  return checkAndTopUp(client, fromAddress, gasLimit, maxFeePerGas);
}
