import useSWR from 'swr';
import { useMemo } from 'react';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { OptionResponseSchema } from '@/shared/types/schema';

export default function useMaterialCategories() {
  const key: SWRKey = {
    url: '/api/material-categories',
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<OptionResponseSchema[]>>(key);

  const categories = useMemo(() => {
    return data?.result ?? [];
  }, [data]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({ label: cat.name, value: cat.id })) ?? [];
  }, [categories]);

  return { categories, categoryOptions, error, isLoading, mutate };
}
