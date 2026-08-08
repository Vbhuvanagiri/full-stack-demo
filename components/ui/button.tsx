import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-1 whitespace-nowrap cursor-pointer rounded text-xs font-semibold transition-all disabled:pointer-events-none disabled:opacity-50 shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-dark-neutral-200 focus-visible:ring-offset-2 border',
  {
    variants: {
      variant: {
        default:
          'bg-brand-950 border-dark-neutral-400 text-dark-neutral-400 hover:bg-brand-950/90 active:bg-brand-950/80',
        secondary:
          'bg-brand-100 border-dark-neutral-400 text-dark-neutral-400 hover:bg-brand-100/90 active:bg-brand-100/80',
        ghost: 'border-transparent hover:bg-accent hover:text-stone-700',
        outline:
          'bg-pastels-polar-200 border-dark-neutral-400 text-dark-neutral-400',
        disabled: 'bg-clam-shell-100 border-clam-shell-500 text-clam-shell-500',
      },
      size: {
        default: 'h-8 p-2',
        sm: 'h-7 p-2.5 py-1.5 text-xs',
        lg: 'h-10 px-4 py-2.5',
        icon: 'size-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
