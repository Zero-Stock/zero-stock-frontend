import { useMemo } from 'react';
import useSWR from 'swr';
import type { Dish, PaginatedResponse } from '../mockdata';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export function useDishList() {
  const key: SWRKey = {
    url: '/api/dishes/',
    options: {
      query: {
        page_size: 200,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<{ results: PaginatedResponse<Dish> }>(key);

  const dishes = useMemo(() => {
    return data?.results.results ?? [];
  }, [data]);

  return {
    dishes,
    isLoading,
    isError: error,
    mutate,
  };
}
