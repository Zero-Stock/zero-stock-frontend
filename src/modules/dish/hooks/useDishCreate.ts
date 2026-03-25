import { apiClient } from '@/shared/api/apiClient.client';
import type { DishWritePayload } from '../mockdata';

export function useDishCreate() {
  return {
    trigger: async (payload: DishWritePayload) => {
      return apiClient.post('/api/dishes/', {
        body: payload,
      });
    },
  };
}
