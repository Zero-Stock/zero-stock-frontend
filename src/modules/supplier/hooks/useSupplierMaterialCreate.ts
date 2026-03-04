import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierMaterialCreateDto } from '../dtos/supplierMaterialCreate.dto';

export function useSupplierMaterialCreate() {
  return {
    trigger: async (data: SupplierMaterialCreateDto) => {
      return apiClient.post('/api/supplier-materials/', {
        body: data,
      });
    },
  };
}
