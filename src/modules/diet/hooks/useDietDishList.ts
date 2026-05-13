import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DishListResponseSchema } from '@/shared/types/schema';

export function useDietDishList(enabled = true) {
  const key: SWRKey | null = enabled
    ? {
        url: '/api/dishes/list',
        method: 'POST',
        options: {
          body: {
            page_size: 10000,
          },
        },
      }
    : null;

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
