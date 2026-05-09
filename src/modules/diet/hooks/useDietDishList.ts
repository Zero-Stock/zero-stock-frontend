import { useMemo } from 'react';
import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { DishListResponseSchema } from '@/shared/types/schema';

export function useDietDishList() {
  const key: SWRKey = {
    url: '/api/dishes/list',
    method: 'POST',
    options: {
      body: {
        page_size: 500,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<DishListResponseSchema>>(key);

  const dishes = useMemo(() => data?.result.list ?? [], [data]);

  return {
    dishes,
    isLoading,
    isError: error,
    mutate,
  };
}
