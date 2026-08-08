'use client';

import { Check, Copy } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard';

interface TruncatedTextProps {
  text: string;
  maxLength?: number;
  showTooltip?: boolean;
  className?: string;
  copyable?: boolean;
  prefixLength?: number;
  suffixLength?: number;
  ellipsis?: string;
}

export function TruncatedText({
  text,
  maxLength = 20,
  showTooltip = true,
  className,
  copyable = false,
  prefixLength,
  suffixLength,
  ellipsis = '...',
}: TruncatedTextProps) {
  const { isCopied, copyToClipboard } = useCopyToClipboard();

  const getTruncatedText = () => {
    if (!text) return '';
    if (text.length <= maxLength) return text;

    if (prefixLength !== undefined && suffixLength !== undefined) {
      return `${text.slice(0, prefixLength)}${ellipsis}${text.slice(-suffixLength)}`;
    }

    return `${text.slice(0, maxLength - ellipsis.length)}${ellipsis}`;
  };

  const truncatedText = getTruncatedText();
  const isTextTruncated = truncatedText !== text;

  return (
    <span
      className={cn(
        'inline-flex items-center',
        copyable && 'cursor-pointer transition-colors hover:text-blue-600',
        className,
      )}
      onClick={copyable ? () => copyToClipboard(text) : undefined}
      title={showTooltip && isTextTruncated ? text : undefined}
    >
      <span className='font-mono text-sm'>{truncatedText}</span>
      {copyable && (
        <span className='ml-1 text-gray-400 hover:text-gray-600'>
          {isCopied ? (
            <Check className='h-3 w-3' />
          ) : (
            <Copy className='h-3 w-3' />
          )}
        </span>
      )}
    </span>
  );
}
