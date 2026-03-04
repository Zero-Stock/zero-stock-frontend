import { apiClient } from '@/shared/api/apiClient.client';

export function useSupplierDelete() {
  return {
    trigger: async (id: number) => {
      return apiClient.delete(`/api/suppliers/${id}/`);
    },
  };
}
