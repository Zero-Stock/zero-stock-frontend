import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type {
  SupplierMaterialListResponseSchema,
  SupplierMaterialQuerySchema,
} from '@/shared/types/schema';

export function useSupplierMaterials(payload?: SupplierMaterialQuerySchema) {
  const key: SWRKey | null = payload
    ? {
        url: '/api/supplier-materials/list',
        method: 'POST',
        options: {
          body: payload,
        },
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<SupplierMaterialListResponseSchema>>(key);

  return {
    materials: data?.result.list ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
