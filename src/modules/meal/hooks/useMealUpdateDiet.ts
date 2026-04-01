import { apiClient } from '@/shared/api/apiClient.client';
import type { DietCategory } from '../dtos/diet.dto';

export function useMealUpdateDiet() {
  return {
    trigger: async (dietId: number, name: string) => {
      return apiClient.put<DietCategory>(`/api/diets/${dietId}/`, {
        body: { name },
      });
    },
  };
}
