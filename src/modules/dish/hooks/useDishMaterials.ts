import { useMemo } from 'react';
import useSWR from 'swr';
import type { RawMaterialDto } from '../dtos/rawMaterial.dto';
import type { ApiListResponseDto } from '@/shared/types/apiResponse.dto';
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
    useSWR<ApiListResponseDto<RawMaterialDto[]>>(key);

  const materials = useMemo(() => {
    return data?.result.list ?? [];
  }, [data]);

  return {
    materials,
    isLoading,
    isError: error,
    mutate,
  };
}
