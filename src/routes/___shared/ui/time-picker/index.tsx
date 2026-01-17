import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Drawer, DrawerContent } from '../drawer';
import { Input } from '../input';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';

interface TimePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export default function TimePicker({
  value,
  onValueChange,
  placeholder = '',
}: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>();
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value) {
      const hours = value.getHours();
      setSelectedHour(hours % 12 || 12);
      setSelectedMinute(value.getMinutes());
      setSelectedPeriod(hours >= 12 ? 'PM' : 'AM');
    } else {
      const now = new Date();
      const hours = now.getHours();
      setSelectedHour(hours % 12 || 12);
      setSelectedMinute(now.getMinutes());
      setSelectedPeriod(hours >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  const hourOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

  const minuteOptions = Array.from({ length: 60 }, (_, i) => ({
    value: i,
    label: i.toString().padStart(2, '0'),
  }));

  const periodOptions = [
    { value: 'AM' as const, label: 'AM' },
    { value: 'PM' as const, label: 'PM' },
  ];

  const handleConfirm = () => {
    if (selectedHour !== undefined && selectedMinute !== undefined) {
      const date = new Date();
      let hours = selectedHour;
      if (selectedPeriod === 'PM' && selectedHour !== 12) {
        hours += 12;
      } else if (selectedPeriod === 'AM' && selectedHour === 12) {
        hours = 0;
      }
      date.setHours(hours, selectedMinute, 0, 0);
      onValueChange?.(date);
    }
    setOpen(false);
  };

  const Clock = (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        viewBox="0 0 256 256"
        role="img"
        aria-label="Clock icon"
        {...props}
      >
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm64-88a8,8,0,0,1-8,8H128a8,8,0,0,1-8-8V72a8,8,0,0,1,16,0v48h48A8,8,0,0,1,192,128Z"></path>
      </svg>
    );
  };

  const SmallX = (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        viewBox="0 0 256 256"
        role="img"
        aria-label="Close icon"
        {...props}
      >
        <path d="M205.66,194.34a8,8,0,0,1-11.32,11.32L128,139.31,61.66,205.66a8,8,0,0,1-11.32-11.32L116.69,128,50.34,61.66A8,8,0,0,1,61.66,50.34L128,116.69l66.34-66.35a8,8,0,0,1,11.32,11.32L139.31,128Z"></path>
      </svg>
    );
  };

  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  return (
    <>
      <div className="relative">
        <Input
          readOnly
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          value={value ? formatTime(value) : ''}
          placeholder={placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="pr-10 cursor-pointer"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear time selection"
            title="Clear time selection"
            onPointerDown={(e) => {
              e.stopPropagation();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
            }}
            onClick={(e) => {
              e.stopPropagation();
              onValueChange?.(undefined);
              setOpen(false);
            }}
            className="absolute right-8 top-1/2 -translate-y-1/2 flex items-center justify-center h-5 w-5 rounded-full bg-primary/50 text-primary-foreground"
          >
            <SmallX className="h-3 w-3" />
          </button>
        )}
        <Clock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="p-4">
            <WheelPickerWrapper>
              <WheelPicker
                options={hourOptions}
                value={selectedHour}
                onValueChange={setSelectedHour}
                infinite
                visibleCount={12}
              />
              <WheelPicker
                options={minuteOptions}
                value={selectedMinute}
                onValueChange={setSelectedMinute}
                infinite
                visibleCount={12}
              />
              <WheelPicker
                options={periodOptions}
                value={selectedPeriod}
                onValueChange={setSelectedPeriod}
                infinite={false}
                visibleCount={12}
              />
            </WheelPickerWrapper>
            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
}
