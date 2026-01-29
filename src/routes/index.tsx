import { createFileRoute, useRouter } from '@tanstack/react-router';
import { toast } from 'sonner';
import i18n from '@/helpers/i18n';
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

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  const router = useRouter();
  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">UI Components</h1>
        <div className="flex gap-2">
          <ThemeToggle />
        </div>
      </div>
      <h1>Buttons</h1>
      <div className="flex flex-wrap gap-2">
        <Button onClick={() => window.location.reload()}>
          {i18n.t('common:loadTodos')}
        </Button>
        <Button
          variant={'destructive'}
          onClick={() => {
            router.navigate({
              to: '/biometric',
            });
          }}
        >
          {i18n.t('common:loadTodos')}
        </Button>
        <Button
          variant={'ghost'}
          onClick={() => {
            window.open('x-safari-https://pay.payos.vn/web/1029d05aeb394a898be20bb74fcc15fb/');
          }}
        >
          {i18n.t('common:loadTodos')}
        </Button>
        <Button variant={'link'}>{i18n.t('common:loadTodos')}</Button>
        <Button
          variant={'outline'}
          onClick={() => toast.info('This is a success toast!')}
        >
          {i18n.t('common:loadTodos')}
        </Button>
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
    </div>
  );
}
