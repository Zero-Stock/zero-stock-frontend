import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ReceivingListResponseSchema } from '@/shared/types/schema';
import type { ReceivingPreviewDto } from '../dtos/receivingPreview.dto';

interface UseReceivingListParams {
  search?: string;
}

export function useReceivingList(params?: UseReceivingListParams) {
  const selectedDate = useDateStore((state) => state.date);

  const key: SWRKey = {
    url: '/api/receiving/list',
    method: 'POST',
    date: selectedDate,
    options: {
      body: {
        company_id: 1,
        name: params?.search,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ReceivingListResponseSchema>>(key);

  const receivings = useMemo(() => {
    return (data?.result.list ?? []) as ReceivingPreviewDto[];
  }, [data]);

  return {
    receivings,
    error,
    isLoading,
    mutate,
  };
}
