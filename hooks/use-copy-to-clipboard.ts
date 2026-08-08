'use client';

import { useState } from 'react';

export function useCopyToClipboard(resetDelay = 2000) {
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  async function copyToClipboard(text: string) {
    try {
      // Try modern clipboard API first
      if (navigator?.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        setIsCopied(true);
        setError(null);

        setTimeout(() => {
          setIsCopied(false);
        }, resetDelay);
        return;
      }

      // Fallback for mobile and older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;

      // Make the textarea invisible but still focusable
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      textArea.style.opacity = '0';
      textArea.style.pointerEvents = 'none';
      textArea.setAttribute('readonly', '');
      textArea.setAttribute('tabindex', '-1');

      document.body.appendChild(textArea);

      // Focus and select the text
      textArea.focus();
      textArea.select();
      textArea.setSelectionRange(0, text.length);

      // For iOS Safari - additional selection method
      if (navigator.userAgent.match(/ipad|iphone/i)) {
        const range = document.createRange();
        range.selectNodeContents(textArea);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
        textArea.setSelectionRange(0, text.length);
      }

      const successful = document.execCommand('copy');
      document.body.removeChild(textArea);

      if (!successful) {
        throw new Error('Copy command failed');
      }

      setIsCopied(true);
      setError(null);

      setTimeout(() => {
        setIsCopied(false);
      }, resetDelay);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to copy'));
      setIsCopied(false);
    }
  }

  return { isCopied, copyToClipboard, error };
}
