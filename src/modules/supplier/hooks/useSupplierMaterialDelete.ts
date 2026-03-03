import { apiClient } from '@/shared/api/apiClient.client';

export function useSupplierMaterialDelete() {
  return {
    trigger: async (id: number) => {
      return apiClient.delete(`/api/supplier-materials/${id}/`);
    },
  };
}
