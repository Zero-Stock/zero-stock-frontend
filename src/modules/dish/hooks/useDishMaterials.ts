import { useMemo } from 'react';
import useSWR from 'swr';
import type { PaginatedResponse } from '../mockdata';
import type { RawMaterialDto } from '../dtos/rawMaterial.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export function useDishMaterials(enabled = true) {
  const key: SWRKey | null = enabled
    ? {
        url: '/api/materials/',
        options: {
          query: {
            page_size: 500,
          },
        },
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<{ results: PaginatedResponse<RawMaterialDto> }>(key);

  const materials = useMemo(() => {
    return data?.results.results ?? [];
  }, [data]);

  return {
    materials,
    isLoading,
    isError: error,
    mutate,
  };
}
