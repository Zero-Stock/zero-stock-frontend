import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import { useMemo } from 'react';
import type { MaterialCategoryDto } from '../dtos/materialCategory.dto';

export default function useMaterialCategories() {
  const { data, error, isLoading, mutate } = useSWR<MaterialCategoryDto[]>([
    '/api/material-categories/',
  ]);

  const categories = useMemo(() => {
    return data ?? [];
  }, [data]);

  const categoryOptions = useMemo(() => {
    return categories.map((cat) => ({ label: cat.name, value: cat.id })) ?? [];
  }, [data]);

  console.log('categories', categoryOptions);

  return { categories, categoryOptions, error, isLoading, mutate };
}
