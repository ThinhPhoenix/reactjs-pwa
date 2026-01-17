import * as SwitchPrimitive from '@radix-ui/react-switch';
import type * as React from 'react';

import { cn } from '@/helpers/utils';
import { useHaptics } from '@/routes/___shared/hooks/common/use-haptics';

interface SwitchProps extends React.ComponentProps<
  typeof SwitchPrimitive.Root
> {
  thumb?: React.ReactNode;
}

function Switch({ className, thumb, onCheckedChange, ...props }: SwitchProps) {
  const triggerHaptics = useHaptics();

  const handleCheckedChange = (checked: boolean) => {
    triggerHaptics();
    onCheckedChange?.(checked);
  };

  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/80 inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent shadow-sm transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer hover:shadow-md relative',
        className,
      )}
      onCheckedChange={handleCheckedChange}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          'bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-5 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[1.25rem] data-[state=unchecked]:translate-x-0 flex items-center justify-center shadow-sm absolute left-[1.2px]',
        )}
      >
        {thumb}
      </SwitchPrimitive.Thumb>
    </SwitchPrimitive.Root>
  );
}

export { Switch };
