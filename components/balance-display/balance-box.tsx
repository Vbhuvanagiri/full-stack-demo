'use client';

import { ArrowUpDown, Send } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function BalanceBox({
  amount,
  usdValue,
  tokenSymbol,
  icon,
  className,
  onSwapClick,
  onSendClick,
}: {
  amount: string;
  usdValue: string;
  tokenSymbol: string;
  icon: React.ReactNode;
  className?: string;
  onSwapClick?: () => void;
  onSendClick?: () => void;
}) {
  return (
    <div
      className={cn(
        'border-colors-dark-neutral-200 flex w-full max-w-full gap-4 border-t py-4 sm:items-center sm:justify-between sm:py-5',
        className,
      )}
    >
      <div className='flex min-w-0 flex-1 gap-4 sm:gap-5'>
        <div className='flex min-w-0 flex-col gap-1 sm:gap-2'>
          <div className='text-tundora-300 truncate text-2xl font-light sm:text-3xl'>
            {amount}
          </div>
          <div className='text-tundora-50 text-sm font-semibold'>
            {usdValue}
          </div>
        </div>
        <div className='flex flex-shrink-0 items-center gap-3 sm:gap-4'>
          {icon}
          <span className='text-tundora-300 text-sm font-bold sm:text-base'>
            {tokenSymbol}
          </span>
        </div>
      </div>
      <div className='flex justify-end sm:justify-start'>
        <div className='flex items-center gap-4'>
          <Button variant='default' size='default' disabled onClick={onSwapClick}>
            <ArrowUpDown className='h-3 w-3' />
            Swap
          </Button>
          <Button variant='secondary' size='default' onClick={onSendClick}>
            <Send className='h-3 w-3' />
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
