import { apiClient } from '@/shared/api/apiClient.client';
import type { MaterialUpdateDto } from '../dtos/materialUpdate.dto';

export function useMaterialUpdate() {
  return {
    trigger: async (data: MaterialUpdateDto) => {
      return apiClient.post<MaterialUpdateDto>(`/api/materials/batch/`, {
        body: [data],
      });
    },
  };
}
