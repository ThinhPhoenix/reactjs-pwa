import i18n from '@/helpers/i18n';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { Button } from './___shared/ui/button';
import DatePicker from './___shared/ui/date-picker';
import DateTimePicker from './___shared/ui/date-time-picker';
import { Input } from './___shared/ui/input';
import TimePicker from './___shared/ui/time-picker';
import DateRangePicker from './___shared/ui/date-range-picker';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  return (
    <div className="p-4">
      <h1>Buttons</h1>
      <div className="flex flex-wrap gap-2">
        <Button>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'destructive'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'ghost'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'link'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'outline'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'secondary'}>{i18n.t('common:loadTodos')}</Button>
      </div>
      <h1>Inputs</h1>
      <div className="flex flex-col gap-2">
        <Input type="text" />
        <Input type="password" />
        <DatePicker
          value={selectedDate}
          onValueChange={setSelectedDate}
        />
        <TimePicker />
        <DateRangePicker />
        <DateTimePicker />
      </div>
    </div>
  );
}
