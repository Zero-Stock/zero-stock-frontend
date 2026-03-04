import { apiClient } from '@/shared/api/apiClient.client';
import type { SupplierMaterialUpdateDto } from '../dtos/supplierMaterialUpdate.dto';

export function useSupplierMaterialUpdate() {
  return {
    trigger: async (data: SupplierMaterialUpdateDto) => {
      return apiClient.patch(`/api/supplier-materials/${data.id}/`, {
        body: data,
      });
    },
  };
}
