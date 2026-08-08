import { NextRequest, NextResponse } from 'next/server';

import { getUserTransactions } from '@/lib/relayer/tx-registry';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const userAddress = request.nextUrl.searchParams.get('userAddress');

  if (!userAddress) {
    return NextResponse.json(
      { error: 'Missing userAddress parameter' },
      { status: 400 },
    );
  }

  try {
    const transactions = await getUserTransactions(userAddress);
    return NextResponse.json(transactions);
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
