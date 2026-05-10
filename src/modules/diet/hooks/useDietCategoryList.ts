import { useMemo } from 'react';
import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DietOptionSchema } from '@/shared/types/schema';

export function useDietCategoryList() {
  const key: SWRKey = {
    url: '/api/diet',
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<DietOptionSchema[]>>(key);

  const diets = useMemo(() => data?.result ?? [], [data]);

  return {
    diets,
    isLoading,
    isError: error,
    mutate,
  };
}
