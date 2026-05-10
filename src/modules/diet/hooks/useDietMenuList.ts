import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DietDetailSchema } from '@/shared/types/schema';

interface UseDietMenuListOptions {
  dietId?: number;
}

export function useDietMenuList({ dietId }: UseDietMenuListOptions) {
  const key: SWRKey | null = dietId
    ? {
        url: `/api/diet/${dietId}`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<DietDetailSchema>>(key);

  const menuRows = useMemo(() => data?.result.meal_slots ?? [], [data]);

  return {
    menuRows,
    dietDetail: data?.result,
    isLoading,
    isError: error,
    mutate,
  };
}
