import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Drawer, DrawerContent } from '../drawer';
import { Input } from '../input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../tabs';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';

interface DateRange {
  start?: Date;
  end?: Date;
}

interface DateRangePickerProps {
  value?: DateRange;
  onValueChange?: (range: DateRange | undefined) => void;
  placeholder?: string;
}

export default function DateRangePicker({
  value,
  onValueChange,
  placeholder = '',
}: DateRangePickerProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<'start' | 'end'>('start');
  const [startYear, setStartYear] = useState<number>();
  const [startMonth, setStartMonth] = useState<number>();
  const [startDay, setStartDay] = useState<number>();
  const [endYear, setEndYear] = useState<number>();
  const [endMonth, setEndMonth] = useState<number>();
  const [endDay, setEndDay] = useState<number>();

  useEffect(() => {
    if (value?.start) {
      setStartYear(value.start.getFullYear());
      setStartMonth(value.start.getMonth() + 1);
      setStartDay(value.start.getDate());
    } else {
      const now = new Date();
      setStartYear(now.getFullYear());
      setStartMonth(now.getMonth() + 1);
      setStartDay(now.getDate());
    }

    if (value?.end) {
      setEndYear(value.end.getFullYear());
      setEndMonth(value.end.getMonth() + 1);
      setEndDay(value.end.getDate());
    } else {
      const now = new Date();
      setEndYear(now.getFullYear());
      setEndMonth(now.getMonth() + 1);
      setEndDay(now.getDate());
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

  const handleConfirm = () => {
    const startDate =
      startYear && startMonth && startDay
        ? new Date(startYear, startMonth - 1, startDay)
        : undefined;
    const endDate =
      endYear && endMonth && endDay
        ? new Date(endYear, endMonth - 1, endDay)
        : undefined;

    if (startDate && endDate && startDate > endDate) {
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

  const formatRange = () => {
    if (!value?.start && !value?.end) return '';
    const start = value?.start?.toLocaleDateString('en-US') || 'Start';
    const end = value?.end?.toLocaleDateString('en-US') || 'End';
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
            aria-label="Clear date range"
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
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="p-4">
            <Tabs
              value={mode}
              onValueChange={(val) => setMode(val as 'start' | 'end')}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="start">Start Date</TabsTrigger>
                <TabsTrigger value="end">End Date</TabsTrigger>
              </TabsList>

              <TabsContent value="start" className="mt-4">
                <WheelPickerWrapper>
                  <WheelPicker
                    options={monthOptions}
                    value={startMonth}
                    onValueChange={setStartMonth}
                    infinite
                    visibleCount={13}
                  />
                  <WheelPicker
                    options={dayOptions}
                    value={startDay}
                    onValueChange={setStartDay}
                    infinite
                    visibleCount={13}
                  />
                  <WheelPicker
                    options={yearOptions}
                    value={startYear}
                    onValueChange={setStartYear}
                    infinite
                    visibleCount={13}
                  />
                </WheelPickerWrapper>
              </TabsContent>

              <TabsContent value="end" className="mt-4">
                <WheelPickerWrapper>
                  <WheelPicker
                    options={monthOptions}
                    value={endMonth}
                    onValueChange={setEndMonth}
                    infinite
                    visibleCount={13}
                  />
                  <WheelPicker
                    options={dayOptions}
                    value={endDay}
                    onValueChange={setEndDay}
                    infinite
                    visibleCount={13}
                  />
                  <WheelPicker
                    options={yearOptions}
                    value={endYear}
                    onValueChange={setEndYear}
                    infinite
                    visibleCount={13}
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
