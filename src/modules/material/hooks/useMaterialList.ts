import useSWR from 'swr';
import { useMemo } from 'react';
import type {
  MaterialListResponseSchema,
  MaterialQuerySchema,
} from '@/shared/types/schema';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export type MaterialListPayload = MaterialQuerySchema;

export function useMaterialList(payload?: MaterialListPayload) {
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

  const materialOptions = useMemo(() => {
    if (!data) return [];
    return data.result.list.map((material) => ({
      value: material.id,
      label: material.name,
    }));
  }, [data]);

  return {
    materials,
    materialOptions,
    isLoading,
    isError: error,
    mutate,
  };
}
