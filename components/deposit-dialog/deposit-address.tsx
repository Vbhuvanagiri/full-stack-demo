'use client';

import { type ReactElement } from 'react';
import { Copy, Check, Info, Loader2 } from 'lucide-react';
import { NetworkIcon } from '@web3icons/react';

import { Button } from '@/components/ui/button';
import { QRCode } from '@/components/ui/qr-code';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TokenConfig, NetworkData } from '@/lib/constants/token-metadata';
import { formatAddress } from '@/lib/address-utils';
import { useCopyToClipboard } from '@/hooks';
import { cn } from '@/lib/utils';

interface DepositAddressProps {
  token: TokenConfig;
  network: NetworkData;
  depositAddress: string;
  isSubmitting: boolean;
  onContinue: () => void;
}

export function DepositAddress({
  token,
  network,
  depositAddress,
  isSubmitting,
  onContinue,
}: DepositAddressProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const handleCopy = () => {
    copyToClipboard(depositAddress);
  };

  // The QR helper takes a file asset via iconUrl (it only serializes SVG elements).
  const qrIconProps: { iconUrl: string } | { icon: ReactElement } =
    network.chain === 'midnight'
      ? { iconUrl: '/midnight/logomark.svg' }
      : { icon: <NetworkIcon name={network.chain} /> };

  return (
    <div className='gradient-popover w-full space-y-5'>
      <p className='text-dark-neutral-400 font-semibold capitalize'>
        {network.chainName} Address
      </p>

      <div className='border-dark-neutral-400/80 gradient-bg-main flex flex-col justify-center gap-5 rounded-xs border p-5'>
        <QRCode
          value={depositAddress}
          size={200}
          {...qrIconProps}
          className='mx-auto border-none bg-white sm:hidden'
          errorCorrectionLevel='M'
          margin={12}
        />
        <QRCode
          value={depositAddress}
          size={242}
          {...qrIconProps}
          className='mx-auto hidden border-none bg-white sm:block'
          errorCorrectionLevel='M'
          margin={16}
        />

        <div className='bg-pastels-swiss-coffee-50 mx-auto flex w-fit items-center gap-3 px-2 py-1'>
          <span className='text-dark-neutral-400 font-medium'>
            {formatAddress(depositAddress)}
          </span>
          <Button
            variant='ghost'
            size='icon'
            onClick={handleCopy}
            className={cn('text-dark-neutral-400 hover:text-dark-neutral-500')}
          >
            {isCopied ? (
              <Check className='h-5 w-5' />
            ) : (
              <Copy className='h-5 w-5' />
            )}
          </Button>
        </div>
      </div>

      <div className='flex items-center justify-center gap-2'>
        <p className='text-dark-neutral-400 text-center text-sm leading-relaxed'>
          Use this address to deposit {token.name}
        </p>
        <Popover>
          <PopoverTrigger asChild>
            <button type='button' className='cursor-help'>
              <Info className='text-dark-neutral-400 hover:text-dark-neutral-300 h-4 w-4' />
            </button>
          </PopoverTrigger>
          <PopoverContent side='top' className='w-72'>
            <p className='mb-2 text-xs font-medium text-stone-800'>
              How to get {token.name} on testnet
            </p>
            <p className='text-xs leading-relaxed text-stone-600'>
              {token.acquireHint ??
                `Get testnet ${token.symbol} from a faucet.`}
            </p>
            {token.faucetUrl && (
              <a
                href={token.faucetUrl}
                target='_blank'
                rel='noopener noreferrer'
                className='mt-1 inline-block text-xs text-blue-600 underline hover:text-blue-700'
              >
                Get {token.symbol} here
              </a>
            )}
            <div className='mt-2 rounded bg-stone-100 px-2 py-1.5'>
              <p className='text-xs text-stone-500'>
                {network.chain === 'solana'
                  ? 'Mint Address'
                  : 'Contract Address'}
              </p>
              <div className='flex items-center gap-1'>
                <code className='break-all text-xs text-stone-700'>
                  {token.erc20Address}
                </code>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => copyToClipboard(token.erc20Address)}
                  className='h-5 w-5 flex-shrink-0 text-stone-500 hover:text-stone-700'
                >
                  <Copy className='h-3 w-3' />
                </Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div className='flex w-full justify-center'>
        <Button
          onClick={onContinue}
          variant='secondary'
          disabled={isSubmitting}
          className={cn(
            isSubmitting ? 'cursor-not-allowed' : 'cursor-pointer',
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 className='h-4 w-4 animate-spin' />
              Notifying...
            </>
          ) : (
            "I've sent the tokens"
          )}
        </Button>
      </div>
    </div>
  );
}
