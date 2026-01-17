import * as React from 'react';

import { cn } from '@/helpers/utils';
import { useHaptics } from '../../hooks/common/use-haptics';

type TextareaProps = React.ComponentProps<'textarea'> & {
  resize?: 'none' | 'both' | 'horizontal' | 'vertical' | 'block';
  overlay?: boolean;
  onClose?: () => void;
};

function Textarea({
  className,
  resize = 'vertical',
  overlay = false,
  onClose,
  ...props
}: TextareaProps) {
  const triggerHaptics = useHaptics();
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!overlay) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;

      // Don't close if clicking on the textarea container itself
      if (containerRef.current?.contains(target)) {
        return;
      }

      // Only close if clicking on a non-interactive element
      const isInteractiveElement =
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.closest('[data-slot*="picker"]') ||
        target.closest('[role="button"]') ||
        target.closest('[role="option"]') ||
        target.closest('[role="dialog"]');

      if (!isInteractiveElement) {
        onClose?.();
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose?.();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [overlay, onClose]);

  const getResizeClasses = (resizeType: TextareaProps['resize']) => {
    switch (resizeType) {
      case 'none':
        return 'resize-none';
      case 'both':
        return 'resize';
      case 'horizontal':
        return 'resize-x';
      case 'vertical':
        return 'resize-y';
      case 'block':
        return 'resize';
      default:
        return 'resize-y';
    }
  };

  const textareaElement = (
    <textarea
      className={cn(
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex min-h-20 w-full min-w-0 rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        getResizeClasses(resize),
        className,
      )}
      onClick={(e) => {
        props.onClick?.(e);
        triggerHaptics();
      }}
      {...props}
    />
  );

  if (overlay) {
    return (
      <div ref={containerRef} className="relative">
        {textareaElement}
      </div>
    );
  }

  return textareaElement;
}

export { Textarea };
