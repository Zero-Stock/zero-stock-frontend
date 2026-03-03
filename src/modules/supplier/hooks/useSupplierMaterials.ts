import useSWR from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierMaterialDto } from '../dtos/supplierMaterial.dto';

export function useSupplierMaterials(supplierId?: number) {
  const { data, error, isLoading, mutate } = useSWR<SupplierMaterialDto[]>(
    supplierId ? [`/api/suppliers/${supplierId}/materials/`] : null,
    async ([url]) => {
      return apiClient.get<SupplierMaterialDto[]>(url);
    },
  );

  return {
    materials: data ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
