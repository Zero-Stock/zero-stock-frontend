import { apiClient } from '@/shared/api/apiClient.client';

export function useMaterialDelete() {
  return {
    trigger: async (id: number) => {
      return apiClient.delete(`/api/materials/${id}/`);
    },
  };
}
