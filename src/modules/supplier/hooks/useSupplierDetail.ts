import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierDetailDto } from '../dtos/supplierDetail.dto';

export function useSupplierDetail(supplierId?: number) {
  const { data, error, isLoading, mutate } = useSWR<SupplierDetailDto | null>(
    supplierId ? [`/api/suppliers/${supplierId}/`] : null,
    async ([url]) => {
      return apiClient.get<SupplierDetailDto>(url);
    },
  );

  return {
    supplier: data,
    isLoading,
    isError: error,
    mutate,
  };
}
