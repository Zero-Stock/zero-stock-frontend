import { useMemo } from 'react';
import useSWR from 'swr';
import type { Dish } from '../mockdata';
import type { ApiListResponseDto } from '@/shared/types/apiResponse.dto';
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
    useSWR<ApiListResponseDto<Dish[]>>(key);

  const dishes = useMemo(() => {
    return data?.result.list ?? [];
  }, [data]);

  return {
    dishes,
    isLoading,
    isError: error,
    mutate,
  };
}
