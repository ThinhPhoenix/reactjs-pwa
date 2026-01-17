import i18n from '@/helpers/i18n';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useListTodos } from './___shared/hooks/todo/use-list-todos';
import { Button } from './___shared/ui/button';
import DatePicker from './___shared/ui/date-picker';
import { Drawer, DrawerContent } from './___shared/ui/drawer';
import { Input } from './___shared/ui/input';
import { WheelPicker, WheelPickerWrapper } from './___shared/ui/wheel-picker';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [enabled, setEnabled] = useState(false);
  const { data, error, isLoading } = useListTodos(enabled);
  const [selectedValue, setSelectedValue] = useState<number | undefined>();

  const handleClick = () => {
    setEnabled(true);
  };

  const wheelPickerOptions = [
    { value: 1, label: 'One' },
    { value: 2, label: 'Two' },
    { value: 3, label: 'Three' },
    { value: 4, label: 'Four' },
    { value: 5, label: 'Five' },
    { value: 6, label: 'Six' },
    { value: 7, label: 'Seven' },
    { value: 8, label: 'Eight' },
    { value: 9, label: 'Nine' },
    { value: 10, label: 'Ten' },
  ];

  const [selectedDate, setSelectedDate] = useState<Date>();
  return (
    <div className="p-4">
      <div className="flex gap-2">
        <Button onClick={handleClick} isLoading={isLoading}>
          {i18n.t('common:loadTodos')}
        </Button>
      </div>
      <DatePicker
        value={selectedDate}
        onValueChange={setSelectedDate}
        placeholder="Pick a date"
      />
      <div>
        <Input
          placeholder="Type here..."
          className="mt-4 mb-4"
          type="password"
        />
      </div>
      {data && (
        <Drawer open={enabled} onOpenChange={setEnabled}>
          <DrawerContent>
            {/* <div className="todo p-3.5">
              {error && <p>{error.message}</p>}
              {(data as any).map((todo: TodoDto) => {
                return <p key={todo.id}>{todo.title}</p>;
              })}
            </div> */}
            <div className="p-4">
              <WheelPickerWrapper>
                <WheelPicker
                  options={wheelPickerOptions}
                  value={selectedValue}
                  onValueChange={setSelectedValue}
                  infinite
                  visibleCount={13}
                ></WheelPicker>
              </WheelPickerWrapper>
            </div>
          </DrawerContent>
        </Drawer>
      )}
    </div>
  );
}
