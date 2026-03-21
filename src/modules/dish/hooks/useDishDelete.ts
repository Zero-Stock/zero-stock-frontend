import { apiClient } from '@/shared/api/apiClient.client';

export function useDishDelete() {
  return {
    trigger: async (id: number) => {
      return apiClient.delete(`/api/dishes/${id}/`);
    },
  };
}
