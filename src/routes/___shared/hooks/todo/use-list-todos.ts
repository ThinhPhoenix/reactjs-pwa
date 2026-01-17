import api from '@/helpers/axios-instance';
import i18n from '@/helpers/i18n';
import type { TodoDto } from '@/routes/___shared/types/dto/todo.dto';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { endpoints } from '../../endpoints';

export const useListTodos = (enabled: boolean) => {
  const { data, error, isLoading, isSuccess } = useQuery({
    queryKey: [endpoints.todos.list],
    queryFn: () => api.get<TodoDto[]>(endpoints.todos.list),
    enabled,
  });

  useEffect(() => {
    if (isSuccess) {
      toast.success(i18n.t('common:loadTodosSuccess'));
    }
  }, [isSuccess]);

  return { data, error, isLoading };
};
