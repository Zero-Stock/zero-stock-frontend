import { useMemo } from 'react';
import useSWR from 'swr';
import type { ApiListResponseDto } from '@/shared/dtos/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { WeeklyMenuRow } from '../dtos/menu.dto';

interface UseMealMenuListOptions {
  companyId: number;
  dietCategoryId?: number;
}

export function useMealMenuList({
  companyId,
  dietCategoryId,
}: UseMealMenuListOptions) {
  const key: SWRKey | null = dietCategoryId
    ? {
        url: '/api/weekly-menus/',
        options: {
          query: {
            company: companyId,
            diet_category: dietCategoryId,
            page_size: 200,
          },
        },
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiListResponseDto<WeeklyMenuRow[]>>(key);

  const menuRows = useMemo(() => data?.results.results ?? [], [data]);

  return {
    menuRows,
    isLoading,
    isError: error,
    mutate,
  };
}
