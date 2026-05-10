import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DietDetailSchema } from '@/shared/types/schema';

export function useDietCategoryUpdate() {
  return {
    trigger: async (dietId: number, name: string) => {
      return apiClient.put<ApiResponseDto<DietDetailSchema>>(
        `/api/diet/${dietId}`,
        { body: { name } },
      );
    },
  };
}
