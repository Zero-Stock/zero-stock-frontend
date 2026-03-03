import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierMaterialCreateDto } from '../dtos/supplierMaterialCreate.dto';

export function useSupplierMaterialCreate(supplierId: number) {
  return {
    trigger: async (data: SupplierMaterialCreateDto) => {
      return apiClient.post(`/api/suppliers/${supplierId}/materials/`, {
        body: data,
      });
    },
  };
}
