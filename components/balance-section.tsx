'use client';

import { useState, useEffect } from 'react';
import { Download, Package } from 'lucide-react';

import { BalanceDisplay } from '@/components/balance-display';
import { Button } from '@/components/ui/button';
import { DepositDialog } from '@/components/deposit-dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { useUserBalances } from '@/hooks';
import { convertTokenBalancesToDisplayTokens } from '@/lib/utils';
import { useMidnightWallet } from '@/providers/midnight-context';
import { MIDNIGHT_TOKENS } from '@/lib/constants/token-metadata';
import type { TokenWithBalance } from '@/lib/types/token.types';

export function BalanceSection() {
  const { data: userBalances = [], isLoading, error } = useUserBalances();
  const midnight = useMidnightWallet();
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);

  // One row per vault shielded token with a balance, alongside Solana/ETH assets.
  const midnightBalances = midnight.balances;
  const midnightTokens: TokenWithBalance[] =
    midnight.connected && midnightBalances
      ? MIDNIGHT_TOKENS.flatMap(t => {
          const b = midnightBalances.perToken[t.erc20Address.toLowerCase()];
          if (!b || b.vaultUnits === 0n) return [];
          return [
            {
              erc20Address: t.erc20Address,
              symbol: t.symbol,
              name: t.name,
              decimals: b.decimals,
              chain: 'midnight' as const,
              balance: b.vaultUnits,
            },
          ];
        })
      : [];

  const displayTokens = [
    ...convertTokenBalancesToDisplayTokens(userBalances),
    ...midnightTokens,
  ];

  useEffect(() => {
    if (error) {
      console.error('Failed to load balances:', error);
    }
  }, [error]);

  if (isLoading && displayTokens.length === 0) {
    return (
      <div className='flex w-full max-w-full flex-col gap-5'>
        <div className='flex items-center justify-between'>
          <div className='h-6 w-24 animate-pulse rounded bg-gray-200'></div>
          <div className='h-9 w-20 animate-pulse rounded bg-gray-200'></div>
        </div>

        <div className='grid w-full max-w-full gap-4 sm:gap-6 md:grid-cols-2 md:gap-5 lg:gap-10'>
          {Array.from({ length: 2 }).map((_, index) => (
            <div
              key={`loading-balance-${index}`}
              className='border-colors-dark-neutral-200 flex w-full max-w-full flex-col gap-4 border-t py-4 sm:flex-row sm:items-center sm:justify-between sm:py-5'
            >
              <div className='flex min-w-0 flex-1 gap-4 sm:gap-5'>
                <div className='flex min-w-0 flex-col gap-1 sm:gap-2'>
                  <div className='h-8 w-16 animate-pulse rounded bg-gray-200 sm:h-9 sm:w-20'></div>
                  <div className='h-4 w-12 animate-pulse rounded bg-gray-200'></div>
                </div>
                <div className='flex flex-shrink-0 items-center gap-3 sm:gap-4'>
                  <div className='h-7 w-7 animate-pulse rounded-full bg-gray-200'></div>
                  <div className='h-4 w-10 animate-pulse rounded bg-gray-200'></div>
                </div>
              </div>
              <div className='flex justify-end gap-2 sm:justify-start'>
                <div className='h-8 w-16 animate-pulse rounded bg-gray-200'></div>
                <div className='h-8 w-12 animate-pulse rounded bg-gray-200'></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (displayTokens.length === 0) {
    return (
      <div className='flex w-full max-w-full flex-col gap-5'>
        <div className='border-dark-neutral-300 flex w-full items-center justify-between border-t py-5'>
          <h2 className='text-dark-neutral-200 self-start font-semibold uppercase'>
            Balances
          </h2>
          <Button
            onClick={() => setIsDepositDialogOpen(true)}
            variant='outline'
            size='lg'
            className='gap-1.5 font-semibold'
          >
            <Download className='h-4 w-4' />
            Deposit
          </Button>
        </div>
        <EmptyState
          icon={Package}
          title='No tokens found'
          description='Deposit some tokens to get started managing your portfolio.'
          compact
        />
        <DepositDialog
          open={isDepositDialogOpen}
          onOpenChange={setIsDepositDialogOpen}
        />
      </div>
    );
  }

  return <BalanceDisplay tokens={displayTokens} />;
}
