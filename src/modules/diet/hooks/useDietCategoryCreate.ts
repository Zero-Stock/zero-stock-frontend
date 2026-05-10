import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DietDetailSchema } from '@/shared/types/schema';

export function useDietCategoryCreate() {
  return {
    trigger: async (name: string) => {
      return apiClient.post<ApiResponseDto<DietDetailSchema>>('/api/diet', {
        body: { name },
      });
    },
  };
}
