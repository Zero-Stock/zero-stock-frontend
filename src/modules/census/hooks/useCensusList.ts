import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  CensusListResponseSchema,
  CensusQuerySchema,
} from '@/shared/types/schema';

export function useCensusList(payload?: CensusQuerySchema) {
  const selectedDate = useDateStore((state) => state.date);

  const key: SWRKey = {
    url: '/api/census/list',
    method: 'POST',
    options: {
      body: {
        date: selectedDate,
        ...payload,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<CensusListResponseSchema>>(key);

  const census = useMemo(() => {
    if (!data) return [];
    return data.result?.list ?? [];
  }, [data]);

  return {
    census,
    total: data?.result.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
