import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/helpers/utils';

import { Spinner } from '../spinner';
import './button.css';
import { useHaptics } from '../../hooks/common/use-haptics';

const buttonVariants = cva(
  "relative overflow-hidden inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
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
  variant = 'default',
  size = 'default',
  asChild = false,
  isLoading = false,
  onClick,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    isLoading?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';
  const { children, ...restProps } = props;
  const rippleRef = React.useRef<HTMLSpanElement | null>(null);

  const createRipple = (e: React.MouseEvent<HTMLElement>) => {
    const btn = e.currentTarget as HTMLElement;
    const ripple = rippleRef.current;
    if (!ripple || !btn) return;
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    ripple.style.width = ripple.style.height = `${size}px`;
    const left = e.clientX - rect.left - size / 2;
    const top = e.clientY - rect.top - size / 2;
    ripple.style.left = `${left}px`;
    ripple.style.top = `${top}px`;
    ripple.style.opacity = '0.3';
    ripple.style.transform = 'scale(0)';
    ripple.classList.remove('ripple-effect');
    // force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    ripple.offsetHeight;
    ripple.classList.add('ripple-effect');

    const clear = () => {
      ripple.classList.remove('ripple-effect');
      ripple.style.opacity = '';
      ripple.style.transform = '';
      ripple.removeEventListener('animationend', clear);
    };

    ripple.addEventListener('animationend', clear);
  };

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={isLoading || restProps.disabled}
      onMouseDown={createRipple}
      onClick={(event) => {
        onClick?.(event as unknown as React.MouseEvent<HTMLButtonElement>);
        useHaptics();
      }}
      {...restProps}
    >
      {isLoading && <Spinner />}
      {children}
      <span
        ref={rippleRef}
        id="ripple"
        className="absolute rounded-full bg-white/30 opacity-0 transform scale-0 pointer-events-none"
      />
    </Comp>
  );
}

export { Button, buttonVariants };
