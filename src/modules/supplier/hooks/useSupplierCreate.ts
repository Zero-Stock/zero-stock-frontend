import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierCreateDto } from '../dtos/supplierCreate.dto';

export function useSupplierCreate() {
  return {
    trigger: async (data: SupplierCreateDto) => {
      return apiClient.post('/api/suppliers/', { body: data });
    },
  };
}
