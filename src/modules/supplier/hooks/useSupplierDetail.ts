import useSWR from 'swr';
import type { SupplierDetailDto } from '../dtos/supplierDetail.dto';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';

export function useSupplierDetail(supplierId?: number) {
  const key: SWRKey = {
    url: `/api/suppliers/${supplierId}/`,
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<SupplierDetailDto>>(key);

  return {
    supplier: data?.result,
    isLoading,
    isError: error,
    mutate,
  };
}
