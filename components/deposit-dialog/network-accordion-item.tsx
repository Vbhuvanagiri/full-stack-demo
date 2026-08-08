'use client';

import { ChevronDown } from 'lucide-react';
import { NetworkIcon } from '@web3icons/react';

import { CryptoIcon } from '@/components/balance-display/crypto-icon';
import { MidnightLogo } from '@/components/midnight-logo';
import { cn } from '@/lib/utils';
import { NetworkData, TokenConfig } from '@/lib/constants/token-metadata';

interface NetworkAccordionItemProps {
  network: NetworkData;
  isExpanded: boolean;
  onNetworkClick: () => void;
  onTokenSelect: (token: TokenConfig, network: NetworkData) => void;
  className?: string;
}

export function NetworkAccordionItem({
  network,
  isExpanded,
  onNetworkClick,
  onTokenSelect,
  className,
}: NetworkAccordionItemProps) {
  return (
    <div
      className={cn(
        'bg-pastels-green-white-200 overflow-hidden rounded-sm',
        className,
      )}
    >
      {/* Network Header */}
      <button
        className='hover:bg-pastels-green-white-300 flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-4 text-left transition-colors'
        onClick={onNetworkClick}
      >
        <div className='flex items-center gap-3'>
          {network.chain === 'midnight' ? (
            <MidnightLogo className='size-7' />
          ) : (
            <NetworkIcon
              name={network.symbol}
              size={28}
              variant='background'
              className='shrink-0 rounded-full'
            />
          )}
          <div className='flex flex-col'>
            <span className='text-dark-neutral-500 text-base font-medium'>
              {network.chainName}
            </span>
            <span className='text-dark-neutral-300 text-sm'>
              {network.tokens.length} tokens available
            </span>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'text-dark-neutral-400 size-4 transition-transform',
            isExpanded && 'rotate-180',
          )}
        />
      </button>

      {/* Tokens within Network */}
      {isExpanded && (
        <div className='px-4 pb-2'>
          <div className='space-y-0'>
            {network.tokens.map((token, index) => (
              <button
                key={`${token.erc20Address}-${index}`}
                type='button'
                onClick={() => onTokenSelect(token, network)}
                className='hover:bg-pastels-green-white-300 flex w-full items-center gap-3 rounded px-3 py-2 text-left transition-colors'
              >
                <CryptoIcon
                  chain={network.chain}
                  token={token.symbol}
                  className='size-6 shrink-0'
                />
                <div className='flex flex-col'>
                  <span className='text-dark-neutral-500 text-sm font-medium'>
                    {token.symbol}
                  </span>
                  <span className='text-dark-neutral-300 text-xs'>
                    {token.name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
