import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { ProcurementPreviewDto } from '../dtos/procurementPreview.dto';

interface UseProcurementListParams {
  date?: string;
  search?: string;
}

export function useProcurementList(params?: UseProcurementListParams) {
  const queryParams = new URLSearchParams();

  if (params?.date) {
    queryParams.set('date', params.date);
  }

  if (params?.search) {
    queryParams.set('search', params.search);
  }

  const query = queryParams.toString() ? `?${queryParams.toString()}` : '';

  const key: SWRKey = {
    url: `/api/procurement/${query}`,
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcurementPreviewDto[]>>(key);

  const procurements = useMemo(() => {
    return data?.results ?? [];
  }, [data]);

  return {
    procurements,
    error,
    isLoading,
    mutate,
  };
}
