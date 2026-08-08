import { NextRequest, NextResponse } from 'next/server';

import { updateTxStatus } from '@/lib/relayer/tx-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, solanaInitTxHash } = body;

    if (!id || !solanaInitTxHash) {
      return NextResponse.json(
        { error: 'Missing required fields: id and solanaInitTxHash' },
        { status: 400 },
      );
    }

    await updateTxStatus(id, 'pending', { solanaInitTxHash });

    return NextResponse.json({ success: true });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
