import useSWR from 'swr';
import { useMemo } from 'react';
import type { MaterialCategoryDto } from '../dtos/materialCategory.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export default function useMaterialCategories() {
  const key: SWRKey = {
    url: '/api/material-categories/',
  };

  const { data, error, isLoading, mutate } = useSWR<MaterialCategoryDto[]>(key);

  const categories = useMemo(() => {
    return data ?? [];
  }, [data]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({ label: cat.name, value: cat.id })) ?? [];
  }, [data]);

  return { categories, categoryOptions, error, isLoading, mutate };
}
