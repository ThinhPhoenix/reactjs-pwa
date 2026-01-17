import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Drawer, DrawerContent } from '../drawer';
import { Input } from '../input';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';

interface DateTimeRange {
  start?: Date;
  end?: Date;
}

interface DateTimeRangePickerProps {
  value?: DateTimeRange;
  onValueChange?: (range: DateTimeRange | undefined) => void;
  placeholder?: string;
}

export default function DateTimeRangePicker({
  value,
  onValueChange,
  placeholder = '',
}: DateTimeRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'start' | 'end'>('start');
  const [startYear, setStartYear] = useState<number>();
  const [startMonth, setStartMonth] = useState<number>();
  const [startDay, setStartDay] = useState<number>();
  const [startHour, setStartHour] = useState<number>();
  const [startMinute, setStartMinute] = useState<number>();
  const [startPeriod, setStartPeriod] = useState<'AM' | 'PM'>('AM');
  const [endYear, setEndYear] = useState<number>();
  const [endMonth, setEndMonth] = useState<number>();
  const [endDay, setEndDay] = useState<number>();
  const [endHour, setEndHour] = useState<number>();
  const [endMinute, setEndMinute] = useState<number>();
  const [endPeriod, setEndPeriod] = useState<'AM' | 'PM'>('AM');

  useEffect(() => {
    if (value?.start) {
      setStartYear(value.start.getFullYear());
      setStartMonth(value.start.getMonth() + 1);
      setStartDay(value.start.getDate());

      const hours = value.start.getHours();
      setStartHour(hours % 12 || 12);
      setStartMinute(value.start.getMinutes());
      setStartPeriod(hours >= 12 ? 'PM' : 'AM');
    } else {
      const now = new Date();
      setStartYear(now.getFullYear());
      setStartMonth(now.getMonth() + 1);
      setStartDay(now.getDate());

      const hours = now.getHours();
      setStartHour(hours % 12 || 12);
      setStartMinute(now.getMinutes());
      setStartPeriod(hours >= 12 ? 'PM' : 'AM');
    }

    if (value?.end) {
      setEndYear(value.end.getFullYear());
      setEndMonth(value.end.getMonth() + 1);
      setEndDay(value.end.getDate());

      const hours = value.end.getHours();
      setEndHour(hours % 12 || 12);
      setEndMinute(value.end.getMinutes());
      setEndPeriod(hours >= 12 ? 'PM' : 'AM');
    } else {
      const now = new Date();
      setEndYear(now.getFullYear());
      setEndMonth(now.getMonth() + 1);
      setEndDay(now.getDate());

      const hours = now.getHours();
      setEndHour(hours % 12 || 12);
      setEndMinute(now.getMinutes());
      setEndPeriod(hours >= 12 ? 'PM' : 'AM');
    }
  }, [value]);

  const yearOptions = Array.from({ length: 101 }, (_, i) => ({
    value: 1950 + i,
    label: (1950 + i).toString(),
  }));

  const monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];

  const dayOptions = Array.from({ length: 31 }, (_, i) => ({
    value: i + 1,
    label: (i + 1).toString(),
  }));

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
      startYear &&
      startMonth &&
      startDay &&
      startHour !== undefined &&
      startMinute !== undefined
        ? (() => {
            let hours = startHour;
            if (startPeriod === 'PM' && startHour !== 12) {
              hours += 12;
            } else if (startPeriod === 'AM' && startHour === 12) {
              hours = 0;
            }
            return new Date(
              startYear,
              startMonth - 1,
              startDay,
              hours,
              startMinute,
              0,
              0,
            );
          })()
        : undefined;

    const endDate =
      endYear &&
      endMonth &&
      endDay &&
      endHour !== undefined &&
      endMinute !== undefined
        ? (() => {
            let hours = endHour;
            if (endPeriod === 'PM' && endHour !== 12) {
              hours += 12;
            } else if (endPeriod === 'AM' && endHour === 12) {
              hours = 0;
            }
            return new Date(
              endYear,
              endMonth - 1,
              endDay,
              hours,
              endMinute,
              0,
              0,
            );
          })()
        : undefined;

    if (startDate && endDate && startDate >= endDate) {
      return;
    }

    onValueChange?.({ start: startDate, end: endDate });
    setOpen(false);
  };

  const Calendar = (props: React.SVGProps<SVGSVGElement>) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        viewBox="0 0 256 256"
        {...props}
      >
        <path d="M208,32H184V24a8,8,0,0,0-16,0v8H88V24a8,8,0,0,0-16,0v8H48A16,16,0,0,0,32,48V208a16,16,0,0,0,16,16H208a16,16,0,0,0,16-16V48A16,16,0,0,0,208,32ZM72,48v8a8,8,0,0,0,16,0V48h80v8a8,8,0,0,0,16,0V48h24V80H48V48ZM208,208H48V96H208V208Z"></path>
      </svg>
    );
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
        <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Z"></path>
        <path d="M128,64a8,8,0,0,0-8,8v56a8,8,0,0,0,4,6.93l32,18.67a8,8,0,0,0,8-13.86L136,123.26V72A8,8,0,0,0,128,64Z"></path>
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

  const formatDateTime = (date: Date) => {
    const dateStr = date.toLocaleDateString('en-US');
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const timeStr = `${displayHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    return `${dateStr} ${timeStr}`;
  };

  const formatRange = () => {
    if (!value?.start && !value?.end) return '';
    const start = value?.start ? formatDateTime(value.start) : 'Start';
    const end = value?.end ? formatDateTime(value.end) : 'End';
    return `${start} - ${end}`;
  };

  const currentYear = mode === 'start' ? startYear : endYear;
  const currentMonth = mode === 'start' ? startMonth : endMonth;
  const currentDay = mode === 'start' ? startDay : endDay;
  const currentHour = mode === 'start' ? startHour : endHour;
  const currentMinute = mode === 'start' ? startMinute : endMinute;
  const currentPeriod = mode === 'start' ? startPeriod : endPeriod;

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
            aria-label="Clear date and time range"
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
        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1 pointer-events-none">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Clock className="h-4 w-4 text-muted-foreground" />
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="p-4">
            <div className="flex gap-2 mb-4">
              <Button
                variant={mode === 'start' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('start')}
                className="flex-1"
              >
                Start
              </Button>
              <Button
                variant={mode === 'end' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setMode('end')}
                className="flex-1"
              >
                End
              </Button>
            </div>
            <WheelPickerWrapper>
              <WheelPicker
                options={monthOptions}
                value={currentMonth}
                onValueChange={(val) => {
                  if (mode === 'start') setStartMonth(val);
                  else setEndMonth(val);
                }}
                infinite
                visibleCount={7}
              />
              <WheelPicker
                options={dayOptions}
                value={currentDay}
                onValueChange={(val) => {
                  if (mode === 'start') setStartDay(val);
                  else setEndDay(val);
                }}
                infinite
                visibleCount={7}
              />
              <WheelPicker
                options={yearOptions}
                value={currentYear}
                onValueChange={(val) => {
                  if (mode === 'start') setStartYear(val);
                  else setEndYear(val);
                }}
                infinite
                visibleCount={7}
              />
            </WheelPickerWrapper>
            <WheelPickerWrapper className="mt-2">
              <WheelPicker
                options={hourOptions}
                value={currentHour}
                onValueChange={(val) => {
                  if (mode === 'start') setStartHour(val);
                  else setEndHour(val);
                }}
                infinite
                visibleCount={7}
              />
              <WheelPicker
                options={minuteOptions}
                value={currentMinute}
                onValueChange={(val) => {
                  if (mode === 'start') setStartMinute(val);
                  else setEndMinute(val);
                }}
                infinite
                visibleCount={7}
              />
              <WheelPicker
                options={periodOptions}
                value={currentPeriod}
                onValueChange={(val) => {
                  if (mode === 'start') setStartPeriod(val);
                  else setEndPeriod(val);
                }}
                infinite={false}
                visibleCount={7}
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
