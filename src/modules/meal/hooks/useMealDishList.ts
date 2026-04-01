import { useMemo } from 'react';
import useSWR from 'swr';
import type { Dish } from '@/modules/dish/mockdata';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export function useMealDishList() {
  const key: SWRKey = {
    url: '/api/dishes/',
    options: {
      query: {
        page_size: 500,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiListResponseDto<Dish[]>>(key);

  const dishes = useMemo(() => data?.results.results ?? [], [data]);

  return {
    dishes,
    isLoading,
    isError: error,
    mutate,
  };
}
