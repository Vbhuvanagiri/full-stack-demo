'use client';

import { useEffect, useRef, useState, ReactElement } from 'react';
import QRCodeStyling from 'qr-code-styling';
import React from 'react';

import { cn } from '@/lib/utils';

type ErrorCorrectionLevel = 'L' | 'M' | 'Q' | 'H';

interface BaseQRCodeProps {
  value: string;
  size?: number;
  className?: string;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  margin?: number;
}

interface QRCodeWithIcon extends BaseQRCodeProps {
  icon: ReactElement;
  iconUrl?: never;
}

interface QRCodeWithIconUrl extends BaseQRCodeProps {
  icon?: never;
  iconUrl: string;
}

interface QRCodeWithoutIcon extends BaseQRCodeProps {
  icon?: never;
  iconUrl?: never;
}

type QRCodeProps = QRCodeWithIcon | QRCodeWithIconUrl | QRCodeWithoutIcon;

async function convertIconToDataUrl(
  icon: ReactElement,
): Promise<string | undefined> {
  try {
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText =
      'position:absolute;left:-9999px;width:64px;height:64px';
    document.body.appendChild(tempDiv);

    const { createRoot } = await import('react-dom/client');
    const root = createRoot(tempDiv);

    const clonedIcon = React.cloneElement(icon, {
      width: 64,
      height: 64,
    } as React.SVGProps<SVGSVGElement>);

    root.render(clonedIcon);
    await new Promise(resolve => setTimeout(resolve, 50));

    const svg = tempDiv.querySelector('svg');
    let imageDataUrl: string | undefined;

    if (svg) {
      const svgString = new XMLSerializer().serializeToString(svg);
      imageDataUrl = `data:image/svg+xml;base64,${btoa(svgString)}`;
    }

    root.unmount();
    document.body.removeChild(tempDiv);

    return imageDataUrl;
  } catch (error) {
    console.warn('Failed to convert icon to data URL:', error);
    return undefined;
  }
}

export function QRCode({
  value,
  size = 160,
  className,
  icon,
  iconUrl,
  errorCorrectionLevel = 'H',
  margin = 16,
}: QRCodeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const abortController = new AbortController();

    const generateQR = async () => {
      if (!value || !containerRef.current) return;

      try {
        setIsGenerating(true);
        setError(null);
        containerRef.current.innerHTML = '';

        let imageDataUrl: string | undefined;
        if (iconUrl) {
          imageDataUrl = iconUrl;
        } else if (icon) {
          imageDataUrl = await convertIconToDataUrl(icon);
        }

        const qrCode = new QRCodeStyling({
          width: size,
          height: size,
          type: 'svg',
          data: value,
          image: imageDataUrl,
          margin,
          qrOptions: { errorCorrectionLevel },
          dotsOptions: { color: '#000000', type: 'dots' },
          backgroundOptions: { color: '#ffffff' },
          cornersSquareOptions: { color: '#000000', type: 'square' },
          cornersDotOptions: { color: '#000000', type: 'square' },
          imageOptions: imageDataUrl
            ? {
                crossOrigin: 'anonymous',
                margin: 8,
                imageSize: 0.4,
                hideBackgroundDots: true,
              }
            : undefined,
        });

        if (!abortController.signal.aborted && containerRef.current) {
          qrCode.append(containerRef.current);
        }
      } catch (err) {
        console.error('QR Code generation failed:', err);
        if (!abortController.signal.aborted) {
          setError(
            err instanceof Error ? err.message : 'Failed to generate QR code',
          );
        }
      } finally {
        if (!abortController.signal.aborted) {
          setIsGenerating(false);
        }
      }
    };

    generateQR();
    return () => abortController.abort();
  }, [value, size, icon, iconUrl, errorCorrectionLevel, margin]);

  if (error) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-sm border border-red-500/20 bg-red-500/5 p-4',
          className,
        )}
        style={{ width: size, height: size }}
      >
        <div className='text-center text-xs font-medium text-red-500'>
          QR Code Error
        </div>
        <div className='mt-1 text-center text-xs text-red-500/70'>{error}</div>
      </div>
    );
  }

  return (
    <div
      className={cn('relative', className)}
      style={{ width: size, height: size }}
    >
      {/* Loading State */}
      {isGenerating && (
        <div className='bg-pastels-polar-100 border-dark-neutral-50 absolute inset-0 flex flex-col items-center justify-center rounded-sm border'>
          <div className='border-dark-neutral-300 mb-2 h-6 w-6 animate-spin rounded-full border-2 border-t-transparent'></div>
          <div className='text-dark-neutral-400 text-xs font-medium'>
            Generating QR
          </div>
        </div>
      )}

      {/* QR Code Container */}
      <div
        ref={containerRef}
        className={cn(
          'transition-opacity duration-200',
          isGenerating ? 'opacity-0' : 'opacity-100',
        )}
        style={{
          visibility: isGenerating ? 'hidden' : 'visible',
          maxWidth: '100%',
          height: 'auto',
        }}
      />
    </div>
  );
}
