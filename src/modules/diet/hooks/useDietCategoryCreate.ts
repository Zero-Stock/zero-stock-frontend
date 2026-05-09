import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DietCategory } from '../dtos/diet.dto';

export function useDietCategoryCreate() {
  return {
    trigger: async (name: string) => {
      return apiClient.post<ApiResponseDto<DietCategory>>('/api/diets/', {
        body: { name },
      });
    },
  };
}
