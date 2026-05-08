import { useMemo } from 'react';
import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type {
  DishListResponseSchema,
  DishQuerySchema,
} from '@/shared/types/schema';

export function useDishList(payload?: DishQuerySchema) {
  const key: SWRKey = {
    url: '/api/dishes/list',
    method: 'POST',
    options: {
      body: {
        page_size: 200,
        ...payload,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<DishListResponseSchema>>(key);

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
