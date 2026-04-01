import { apiClient } from '@/shared/api/apiClient.client';

export function useMealDeleteDiet() {
  return {
    trigger: async (dietId: number) => {
      return apiClient.delete(`/api/diets/${dietId}/`);
    },
  };
}
