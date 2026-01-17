import { useEffect, useState } from 'react';
import { Button } from '../button';
import { Drawer, DrawerContent } from '../drawer';
import { Input } from '../input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../tabs';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';

interface DateTimePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export default function DateTimePicker({
  value,
  onValueChange,
  placeholder = '',
}: DateTimePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number>();
  const [selectedDay, setSelectedDay] = useState<number>();
  const [selectedHour, setSelectedHour] = useState<number>();
  const [selectedMinute, setSelectedMinute] = useState<number>();
  const [selectedPeriod, setSelectedPeriod] = useState<'AM' | 'PM'>('AM');
  const [activeTab, setActiveTab] = useState<'date' | 'time'>('date');

  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setSelectedMonth(value.getMonth() + 1);
      setSelectedDay(value.getDate());

      const hours = value.getHours();
      setSelectedHour(hours % 12 || 12);
      setSelectedMinute(value.getMinutes());
      setSelectedPeriod(hours >= 12 ? 'PM' : 'AM');
    } else {
      const now = new Date();
      setSelectedYear(now.getFullYear());
      setSelectedMonth(now.getMonth() + 1);
      setSelectedDay(now.getDate());

      const hours = now.getHours();
      setSelectedHour(hours % 12 || 12);
      setSelectedMinute(now.getMinutes());
      setSelectedPeriod(hours >= 12 ? 'PM' : 'AM');
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
    if (
      selectedYear &&
      selectedMonth &&
      selectedDay &&
      selectedHour !== undefined &&
      selectedMinute !== undefined
    ) {
      let hours = selectedHour;
      if (selectedPeriod === 'PM' && selectedHour !== 12) {
        hours += 12;
      } else if (selectedPeriod === 'AM' && selectedHour === 12) {
        hours = 0;
      }

      const date = new Date(
        selectedYear,
        selectedMonth - 1,
        selectedDay,
        hours,
        selectedMinute,
        0,
        0,
      );
      onValueChange?.(date);
    }
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
        <title>Calendar</title>
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
        <title>Clock</title>
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
        <title>Close</title>
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

  return (
    <>
      <div className="relative">
        <Input
          readOnly
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          value={value ? formatDateTime(value) : ''}
          placeholder={placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="pr-10 cursor-pointer"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear date and time"
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
        <DrawerContent className="max-h-[85vh]">
          <div className="p-4 flex flex-col h-full">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as 'date' | 'time')}
            >
              <TabsList className="w-full">
                <TabsTrigger value="date" className="flex-1">
                  Date
                </TabsTrigger>
                <TabsTrigger value="time" className="flex-1">
                  Time
                </TabsTrigger>
              </TabsList>
              <TabsContent value="date" className="mt-4">
                <WheelPickerWrapper>
                  <WheelPicker
                    options={monthOptions}
                    value={selectedMonth}
                    onValueChange={setSelectedMonth}
                    infinite
                    visibleCount={12}
                  />
                  <WheelPicker
                    options={dayOptions}
                    value={selectedDay}
                    onValueChange={setSelectedDay}
                    infinite
                    visibleCount={12}
                  />
                  <WheelPicker
                    options={yearOptions}
                    value={selectedYear}
                    onValueChange={setSelectedYear}
                    infinite
                    visibleCount={12}
                  />
                </WheelPickerWrapper>
              </TabsContent>
              <TabsContent value="time" className="mt-4">
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
              </TabsContent>
            </Tabs>

            <div className="flex-1 overflow-hidden"></div>

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
