import useSWR from 'swr';
import { useMemo } from 'react';
import type {
  MaterialListResponseSchema,
  MaterialQuerySchema,
} from '@/shared/types/schema';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export function useMaterialList(payload?: MaterialQuerySchema) {
  const key: SWRKey = {
    url: '/api/materials/list',
    method: 'POST',
    options: payload
      ? {
          body: payload,
        }
      : {},
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<MaterialListResponseSchema>>(key);

  const materials = useMemo(() => {
    if (!data) return [];
    return data.result?.list ?? [];
  }, [data]);

  return {
    materials,
    total: data?.result?.total ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
