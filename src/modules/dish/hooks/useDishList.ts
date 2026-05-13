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
    options: payload
      ? {
          body: payload,
        }
      : {},
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<DishListResponseSchema>>(key);

  const dishes = useMemo(() => {
    return data?.result.list ?? [];
  }, [data]);

  return {
    dishes,
    total: data?.result?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
