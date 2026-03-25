import { apiClient } from '@/shared/api/apiClient.client';
import type { DishWritePayload } from '../mockdata';

export function useDishUpdate() {
  return {
    trigger: async (id: number, payload: DishWritePayload) => {
      return apiClient.put(`/api/dishes/${id}/`, {
        body: payload,
      });
    },
  };
}
