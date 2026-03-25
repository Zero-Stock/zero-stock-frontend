import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ReceivingPreviewDto } from '../dtos/receivingPreview.dto';

interface UseReceivingListParams {
  search?: string;
}

export function useReceivingList(params?: UseReceivingListParams) {
  const selectedDate = useDateStore((state) => state.date);

  const queryParams = new URLSearchParams();

  if (selectedDate) {
    queryParams.set('date', selectedDate);
  }

  if (params?.search) {
    queryParams.set('search', params.search);
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const key: SWRKey = {
    url: `/api/receivings/${query}`,
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ReceivingPreviewDto[]>>(key);

  const receivings = useMemo(() => {
    return data?.results ?? [];
  }, [data]);

  return {
    receivings,
    error,
    isLoading,
    mutate,
  };
}
