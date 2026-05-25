import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import { useDateStore } from '@/shared/stores/dateStore';
import type {
  ReceivingListResponseSchema,
  ReceivingQuerySchema,
} from '@/shared/types/schema';

export function useReceivingList(params?: Pick<ReceivingQuerySchema, 'name'>) {
  const selectedDate = useDateStore((state) => state.date);

  const key: SWRKey = {
    url: '/api/receiving/list',
    method: 'POST',
    date: selectedDate,
    options: {
      body: {
        company_id: 1,
        name: params?.name,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ReceivingListResponseSchema>>(key);

  const receivings = useMemo(() => {
    return data?.result.list ?? [];
  }, [data]);

  return {
    receivings,
    error,
    isLoading,
    mutate,
  };
}
