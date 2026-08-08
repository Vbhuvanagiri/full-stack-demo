import { after } from 'next/server';
import { NextRequest, NextResponse } from 'next/server';
import { keccak256, encodePacked } from 'viem';

import { handleDeposit } from '@/lib/relayer/handlers';
import { registerTx } from '@/lib/relayer/tx-registry';
import { withFunctionDeadline } from '@/lib/relayer/function-deadline';

export const runtime = 'nodejs';
export const maxDuration = 300;
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userAddress, erc20Address, ethereumAddress, tokenDecimals, tokenSymbol } = body;

    if (!userAddress || !erc20Address || !ethereumAddress) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 },
      );
    }

    // Generate a trackingId from inputs (deterministic, frontend can compute too)
    const trackingId = keccak256(
      encodePacked(
        ['string', 'string', 'string', 'string'],
        [userAddress, erc20Address, ethereumAddress, Date.now().toString()],
      ),
    );

    // Register in KV before background processing
    await registerTx(trackingId, 'deposit', userAddress, ethereumAddress, {
      tokenMint: erc20Address,
      tokenDecimals,
      tokenSymbol,
    });

    after(async () => {
      try {
        const result = await withFunctionDeadline(
          trackingId,
          'deposit',
          () =>
            handleDeposit({
              userAddress,
              erc20Address,
              ethereumAddress,
              trackingId,
            }),
        );
        if (!result.ok) {
          console.error('Deposit processing failed:', result.error);
        } else if ('requestId' in result) {
          console.log('Deposit processed successfully:', result.requestId);
        }
      } catch (error) {
        console.error('Deposit processing error:', error);
      }
    });

    // Return trackingId so frontend can poll status
    return NextResponse.json({ accepted: true, trackingId }, { status: 202 });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
