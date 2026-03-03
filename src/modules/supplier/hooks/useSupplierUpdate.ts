import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierUpdateDto } from '../dtos/supplierUpdate.dto';

export function useSupplierUpdate() {
  return {
    trigger: async (data: SupplierUpdateDto) => {
      return apiClient.patch(`/api/suppliers/${data.id}/`, { body: data });
    },
  };
}
