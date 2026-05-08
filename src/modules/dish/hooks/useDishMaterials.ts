import { useMemo } from 'react';
import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { MaterialListResponseSchema } from '@/shared/types/schema';

export function useDishMaterials(enabled = true) {
  const key: SWRKey | null = enabled
    ? {
        url: '/api/materials/list',
        method: 'POST',
        options: {
          body: {
            page_size: 500,
          },
        },
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<MaterialListResponseSchema>>(key);

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
