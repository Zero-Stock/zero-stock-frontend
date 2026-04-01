import { useMemo } from 'react';
import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { DietCategory } from '../dtos/diet.dto';

export function useMealDietList() {
  const key: SWRKey = {
    url: '/api/diets/',
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<DietCategory[]>>(key);

  const diets = useMemo(() => data?.results ?? [], [data]);

  return {
    diets,
    isLoading,
    isError: error,
    mutate,
  };
}
