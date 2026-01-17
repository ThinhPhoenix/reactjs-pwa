import { useEffect, useState } from 'react';
import { useHaptics } from '../../hooks/common/use-haptics';
import { Button } from '../button';
import { Drawer, DrawerContent } from '../drawer';
import { Input } from '../input';
import { WheelPicker, WheelPickerWrapper } from '../wheel-picker';

interface DatePickerProps {
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  placeholder?: string;
}

export default function DatePicker({
  value,
  onValueChange,
  placeholder = '',
}: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number>();
  const [selectedMonth, setSelectedMonth] = useState<number>();
  const [selectedDay, setSelectedDay] = useState<number>();

  useEffect(() => {
    if (value) {
      setSelectedYear(value.getFullYear());
      setSelectedMonth(value.getMonth() + 1); // months are 0-based
      setSelectedDay(value.getDate());
    } else {
      const now = new Date();
      setSelectedYear(now.getFullYear());
      setSelectedMonth(now.getMonth() + 1);
      setSelectedDay(now.getDate());
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
    if (selectedYear && selectedMonth && selectedDay) {
      const date = new Date(selectedYear, selectedMonth - 1, selectedDay);
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

  return (
    <>
      <div className="relative" onClick={() => useHaptics()}>
        <Input
          readOnly
          onPointerDown={() => useHaptics()}
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          value={value ? value.toLocaleDateString('en-US') : ''}
          placeholder={placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="pr-10 cursor-pointer"
        />
        {value && (
          <button
            type="button"
            aria-label="Clear date"
            title="Clear date"
            onPointerDown={(e) => {
              e.stopPropagation();
              useHaptics();
            }}
            onTouchStart={(e) => {
              e.stopPropagation();
              useHaptics();
            }}
            onMouseDown={(e) => {
              e.stopPropagation();
              useHaptics();
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
        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent>
          <div className="p-4">
            <WheelPickerWrapper>
              <WheelPicker
                options={yearOptions}
                value={selectedYear}
                onValueChange={setSelectedYear}
                infinite
                visibleCount={13}
              />
              <WheelPicker
                options={monthOptions}
                value={selectedMonth}
                onValueChange={setSelectedMonth}
                infinite
                visibleCount={13}
              />
              <WheelPicker
                options={dayOptions}
                value={selectedDay}
                onValueChange={setSelectedDay}
                infinite
                visibleCount={13}
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
