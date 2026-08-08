import { LucideIcon } from 'lucide-react';

import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
  iconClassName?: string;
  compact?: boolean;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
  iconClassName,
  compact = false,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center',
        compact ? 'py-8' : 'min-h-[60vh]',
        className,
      )}
    >
      <div
        className={cn(
          'flex flex-col items-center justify-center text-center',
          compact ? 'max-w-md p-8' : 'max-w-2xl p-6 sm:p-10 md:p-16',
        )}
      >
        {Icon && (
          <div
            className={cn(
              'mb-6 flex items-center justify-center rounded-full',
              compact ? 'h-16 w-16' : 'h-20 w-20',
              'bg-dark-neutral-800',
              iconClassName,
            )}
          >
            <Icon
              className={cn(
                'text-dark-neutral-400',
                compact ? 'h-8 w-8' : 'h-10 w-10',
              )}
            />
          </div>
        )}

        <h2
          className={cn(
            'text-dark-neutral-900 mb-3 font-semibold',
            compact ? 'text-xl' : 'text-2xl sm:text-3xl',
          )}
        >
          {title}
        </h2>

        {description && (
          <p
            className={cn(
              'text-dark-neutral-600 mb-8 text-center',
              compact ? 'max-w-sm text-base' : 'max-w-md text-base sm:text-lg',
            )}
          >
            {description}
          </p>
        )}

        {action && <div className={compact ? '' : 'mt-4'}>{action}</div>}
      </div>
    </div>
  );
}
