import { NextRequest, NextResponse } from 'next/server';
import { type Hex } from 'viem';

import { ensureGasForTransaction } from '@/lib/evm/gas-topup';
import { getEthereumProvider } from '@/lib/rpc';
import {
  ERC20_TRANSFER_GAS_LIMIT,
  ERC20_TRANSFER_MAX_FEE_PER_GAS,
} from '@/lib/midnight/evm-envelope';

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

// EIP-1559 requires the sender's balance to cover the full upfront reservation
// gasLimit * maxFeePerGas of the vault's fixed envelope; 10% margin on top.
const TOPUP_MAX_FEE_WITH_MARGIN = (ERC20_TRANSFER_MAX_FEE_PER_GAS * 110n) / 100n;

// Fee delegation for the Midnight vault flow: the relayer's funding wallet tops up the
// address that will send the MPC-signed ERC-20 transfer (the deposit address on deposit,
// the vault address on withdraw), so Lace users never hand-fund ETH — same as the Solana
// bridge's automatic gas top-up. The Midnight-chain txs (deposit/claim) stay client-side.
export async function POST(request: NextRequest) {
  try {
    const { fromAddress, gasLimit } = await request.json();

    if (!fromAddress) {
      return NextResponse.json(
        { error: 'Missing fromAddress' },
        { status: 400 },
      );
    }

    // A transfer/approve reserves the fixed envelope; a swap needs more (a V3 swap is
    // ~300k), so the caller may request a larger gasLimit. Defaults to the transfer envelope.
    const limit = gasLimit ? BigInt(gasLimit) : ERC20_TRANSFER_GAS_LIMIT;

    const client = getEthereumProvider();
    // Fund fromAddress so its balance >= gasLimit * maxFeePerGas (the vault tx's upfront
    // EIP-1559 reservation), with a 10% margin.
    const { topUpTxHash, topUpAmount } = await ensureGasForTransaction(
      client,
      fromAddress as Hex,
      limit,
      TOPUP_MAX_FEE_WITH_MARGIN,
    );

    // Wait for the top-up to land so the client can broadcast the transfer right after.
    if (topUpTxHash) {
      await client.waitForTransactionReceipt({ hash: topUpTxHash });
    }

    return NextResponse.json({
      ok: true,
      topUpTxHash: topUpTxHash ?? null,
      topUpAmount: topUpAmount.toString(),
    });
  } catch (error) {
    console.error('Midnight gas top-up error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Gas top-up failed' },
      { status: 500 },
    );
  }
}
