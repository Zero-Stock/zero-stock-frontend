import { apiClient } from '@/shared/api/apiClient.client';
import type { MaterialCreateDto } from '../dtos/materialCreate.dto';

export function useMaterialCreate() {
  return {
    trigger: async (payload: MaterialCreateDto[]) => {
      return apiClient.post<MaterialCreateDto[]>('/api/materials/batch/', {
        body: payload,
      });
    },
  };
}
