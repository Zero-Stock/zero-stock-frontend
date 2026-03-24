import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { ReceivingPreviewDto } from '../dtos/receivingPreview.dto';

interface UseReceivingListParams {
  date?: string;
  search?: string;
}

export function useReceivingList(params?: UseReceivingListParams) {
  const queryParams = new URLSearchParams();

  if (params?.date) {
    queryParams.set('date', params.date);
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
