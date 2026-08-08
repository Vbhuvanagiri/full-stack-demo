import { Loader2 } from 'lucide-react';

import { cn } from '@/lib/utils';

interface LoadingStateProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  size = 'md',
  className,
}: LoadingStateProps) {
  const sizeConfig = {
    sm: { icon: 16, text: 'text-sm' },
    md: { icon: 24, text: 'text-base' },
    lg: { icon: 32, text: 'text-lg' },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-4 p-8',
        className,
      )}
    >
      <Loader2
        className='text-muted-foreground animate-spin'
        size={config.icon}
      />
      <p className={cn('text-muted-foreground', config.text)}>{message}</p>
    </div>
  );
}
