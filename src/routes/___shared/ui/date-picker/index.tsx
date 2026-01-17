import { Calendar } from 'lucide-react';
import { useEffect, useState } from 'react';
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
  placeholder = 'Select date',
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

  return (
    <>
      <div className="relative">
        <Input
          readOnly
          onFocus={() => setOpen(true)}
          onClick={() => setOpen(true)}
          value={value ? value.toLocaleDateString('en-US') : ''}
          placeholder={placeholder}
          aria-haspopup="dialog"
          aria-expanded={open}
          className="pr-10 cursor-pointer"
        />
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
