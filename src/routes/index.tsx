import pkg from '@/../package.json';
import i18n from '@/helpers/i18n';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from './___shared/ui/button';
import DatePicker from './___shared/ui/date-picker';
import DateRangePicker from './___shared/ui/date-range-picker';
import DateTimePicker from './___shared/ui/date-time-picker';
import { Input } from './___shared/ui/input';
import { Switch } from './___shared/ui/switch';
import { Textarea } from './___shared/ui/textarea';
import ThemeToggle from './___shared/ui/theme-toggle';
import TimePicker from './___shared/ui/time-picker';
import TimeRangePicker from './___shared/ui/time-range-picker';
import { envConfig } from '@/helpers/constants/env-config';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">UI Components</h1>
        <ThemeToggle />
      </div>
      <h1>Buttons</h1>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => window.location.reload()}>
          {i18n.t('common:loadTodos')}
        </Button>
        <Button variant={'destructive'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'ghost'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'link'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'outline'}>{i18n.t('common:loadTodos')}</Button>
        <Button variant={'secondary'} isLoading>
          {i18n.t('common:loadTodos')}
        </Button>
      </div>
      <h1>Inputs</h1>
      <div className="flex flex-col gap-2">
        <Input type="text" />
        <Input type="password" />
        <DatePicker />
        <TimePicker />
        <DateRangePicker />
        <DateTimePicker />
        <TimeRangePicker />
        <Textarea />
        <Switch />
      </div>
      <div className='fixed bottom-0 left-0 w-full text-center mb-2'>
        <p>waheim - {pkg.version} - {envConfig.bunEnv}</p>
      </div>
    </div>
  );
}
