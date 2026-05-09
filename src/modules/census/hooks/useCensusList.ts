import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import { useDateStore } from '@/shared/stores/dateStore';
import type { components } from '@/shared/types/schema';

export function useCensusList(
  payload?: components['schemas']['CensusQuerySchema'],
) {
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

  const { data, error, isLoading, mutate } = useSWR<
    Omit<components['schemas']['ApiResponseDto'], 'result'> & {
      result: components['schemas']['CensusListResponseSchema'];
    }
  >(key);

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
