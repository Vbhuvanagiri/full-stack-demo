'use client';

import { TokenIcon, NetworkIcon } from '@web3icons/react';

import { MidnightLogo } from '@/components/midnight-logo';
import { cn } from '@/lib/utils';

export function CryptoIcon({
  chain,
  token,
  className,
}: {
  chain: string;
  token: string;
  className?: string;
}) {
  // Extract size number from className or default to 7
  const sizeNumber = parseInt(className?.match(/size-(\d+)/)?.[1] || '7');

  // Calculate icon sizes based on the container size
  const tokenSize = sizeNumber * 4; // 4px per size unit
  const networkSize = Math.max(12, sizeNumber * 2); // Minimum 12px, otherwise 2px per size unit

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-full shadow-sm',
        className,
      )}
    >
      <TokenIcon
        symbol={token}
        size={tokenSize}
        variant='background'
        className='rounded-full'
      />

      {chain === 'midnight' ? (
        <MidnightLogo
          className={cn(
            'absolute -right-1.5 bottom-0',
            sizeNumber <= 4 ? 'size-3' : 'size-4',
          )}
        />
      ) : (
        <NetworkIcon
          name={chain}
          size={networkSize}
          variant='background'
          className={cn(
            'absolute -right-1.5 bottom-0 rounded-sm',
            sizeNumber <= 4 ? 'size-3' : 'size-4',
          )}
        />
      )}
    </div>
  );
}
