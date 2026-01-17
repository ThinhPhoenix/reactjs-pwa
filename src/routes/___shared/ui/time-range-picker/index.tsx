import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Drawer, DrawerContent } from '../drawer';
import { Input } from '../input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';

interface TimeRange {
  start?: Date;
  end?: Date;
}

interface TimeRangePickerProps {
  value?: TimeRange;
  onValueChange?: (range: TimeRange | undefined) => void;
  placeholder?: string;
}

export default function TimeRangePicker({
  value,
  onValueChange,
  placeholder = '',
}: TimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'start' | 'end'>('start');
  const [startHour, setStartHour] = useState<number>();
  const [startMinute, setStartMinute] = useState<number>();
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM');
  const [endHour, setEndHour] = useState<number>();
  const [endMinute, setEndMinute] = useState<number>();
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value?.start) {
      const hours = value.start.getHours();
      setStartHour(hours % 12 || 12);
      setStartMinute(value.start.getMinutes());
      setStartPeriod(hours >= 12 ? 'PM' : 'AM');
    } else {
      const now = new Date();
      const hours = now.getHours();
      setStartHour(hours % 12 || 12);
      setStartMinute(now.getMinutes());
      setStartPeriod(hours >= 12 ? 'PM' : 'AM');
    }

    if (value?.end) {
      const hours = value.end.getHours();
      setEndHour(hours % 12 || 12);
      setEndMinute(value.end.getMinutes());
      setEndPeriod(hours >= 12 ? 'PM' : 'AM');
    } else {
      const now = new Date();
      const hours = now.getHours();
      setEndHour(hours % 12 || 12);
      setEndMinute(now.getMinutes());
      setEndPeriod(hours >= 12 ? 'PM' : 'AM');
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
    const startDate =
      startHour !== undefined && startMinute !== undefined
        ? (() => {
            const date = new Date();
            let hours = startHour;
            if (startPeriod === 'PM' && startHour !== 12) {
              hours += 12;
            } else if (startPeriod === 'AM' && startHour === 12) {
              hours = 0;
            }
            date.setHours(hours, startMinute, 0, 0);
            return date;
          })()
        : undefined;

    const endDate =
      endHour !== undefined && endMinute !== undefined
        ? (() => {
            const date = new Date();
            let hours = endHour;
            if (endPeriod === 'PM' && endHour !== 12) {
              hours += 12;
            } else if (endPeriod === 'AM' && endHour === 12) {
              hours = 0;
            }
            date.setHours(hours, endMinute, 0, 0);
            return date;
          })()
        : undefined;

    if (startDate && endDate && startDate >= endDate) {
      return;
    }

    onValueChange?.({ start: startDate, end: endDate });
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
        {...props}
      >
        <path d="M232,136.66A104.12,104.12,0,1,1,119.34,24,8,8,0,0,1,120.66,40,88.12,88.12,0,1,0,216,135.34,8,8,0,0,1,232,136.66ZM120,72v56a8,8,0,0,0,8,8h56a8,8,0,0,0,0-16H136V72a8,8,0,0,0-16,0Zm40-24a12,12,0,1,0-12-12A12,12,0,0,0,160,48Zm36,24a12,12,0,1,0-12-12A12,12,0,0,0,196,72Zm24,36a12,12,0,1,0-12-12A12,12,0,0,0,220,108Z"></path>
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

  const formatRange = () => {
    if (!value?.start && !value?.end) return '';
    const start = value?.start ? formatTime(value.start) : 'Start';
    const end = value?.end ? formatTime(value.end) : 'End';
    return `${start} - ${end}`;
  };

  return (
    <>
      <div className="relative">
        <Input
          readOnly
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          value={formatRange()}
          placeholder={placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="pr-10 cursor-pointer"
        />
        {(value?.start || value?.end) && (
          <button
            type="button"
            aria-label="Clear time range"
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
            <Tabs
              value={mode}
              onValueChange={(val) => setMode(val as 'start' | 'end')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="start">Start Time</TabsTrigger>
                <TabsTrigger value="end">End Time</TabsTrigger>
              </TabsList>

              <TabsContent value="start" className="mt-4">
                <WheelPickerWrapper>
                  <WheelPicker
                    options={hourOptions}
                    value={startHour}
                    onValueChange={setStartHour}
                    infinite
                    visibleCount={12}
                  />
                  <WheelPicker
                    options={minuteOptions}
                    value={startMinute}
                    onValueChange={setStartMinute}
                    infinite
                    visibleCount={12}
                  />
                  <WheelPicker
                    options={periodOptions}
                    value={startPeriod}
                    onValueChange={setStartPeriod}
                    infinite={false}
                    visibleCount={12}
                  />
                </WheelPickerWrapper>
              </TabsContent>

              <TabsContent value="end" className="mt-4">
                <WheelPickerWrapper>
                  <WheelPicker
                    options={hourOptions}
                    value={endHour}
                    onValueChange={setEndHour}
                    infinite
                    visibleCount={12}
                  />
                  <WheelPicker
                    options={minuteOptions}
                    value={endMinute}
                    onValueChange={setEndMinute}
                    infinite
                    visibleCount={12}
                  />
                  <WheelPicker
                    options={periodOptions}
                    value={endPeriod}
                    onValueChange={setEndPeriod}
                    infinite={false}
                    visibleCount={12}
                  />
                </WheelPickerWrapper>
              </TabsContent>
            </Tabs>
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
