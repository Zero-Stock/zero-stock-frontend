import useSWR from 'swr';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import type { SupplierPreviewSchema } from '@/shared/types/schema';

export function useSupplierDetail(supplierId?: number) {
  const key: SWRKey | null = supplierId
    ? {
        url: `/api/suppliers/${supplierId}`,
      }
    : null;

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<SupplierPreviewSchema>>(key);

  return {
    supplier: data?.result,
    isLoading,
    isError: error,
    mutate,
  };
}
