'use client';

import { Settings } from 'lucide-react';
import Image from 'next/image';

import { Button } from '@/components/ui/button';
import { WalletButton } from '@/components/wallet-button';
import { cn } from '@/lib/utils';

interface NavigationHeaderProps {
  className?: string;
  onSettingsClick?: () => void;
}

export function NavigationHeader({
  className,
  onSettingsClick,
}: NavigationHeaderProps) {
  return (
    <header
      className={cn(
        'border-dark-neutral-50 h-16 w-full border-b bg-stone-100 sm:h-20',
        className,
      )}
    >
      <div className='container mx-auto flex h-full items-center justify-between p-4 md:p-0'>
        {/* Left: Logo */}
        <div className='flex-shrink-0'>
          <Image
            src='/logo.svg'
            alt='Logo'
            width={120}
            height={24}
            className='max-w-24 object-contain sm:h-7 sm:w-36 sm:max-w-36'
            priority
          />
        </div>

        {/* Right: Settings & Wallet */}
        <div className='flex flex-shrink-0 items-center justify-end space-x-2 sm:space-x-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={onSettingsClick}
            className='h-8 w-8 text-stone-700 hover:bg-stone-700/10 sm:h-10 sm:w-10'
            aria-label='Settings'
          >
            <Settings className='h-4 w-4 sm:h-5 sm:w-5' />
          </Button>
          <WalletButton />
        </div>
      </div>
    </header>
  );
}
