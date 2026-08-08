import Image from 'next/image';

import { cn } from '@/lib/utils';

// Midnight's logomark in a white circle — @web3icons has no Midnight network icon.
export function MidnightLogo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-white',
        className,
      )}
      title='Midnight'
    >
      <Image
        src='/midnight/logomark.svg'
        alt='Midnight'
        width={28}
        height={28}
        className='h-full w-full'
        unoptimized
      />
    </span>
  );
}
