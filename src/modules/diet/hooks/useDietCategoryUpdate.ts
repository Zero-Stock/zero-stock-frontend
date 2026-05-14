import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DietDetailSchema, DietUpsertSchema } from '@/shared/types/schema';

export function useDietCategoryUpdate() {
  return {
    trigger: async (dietId: number, payload: DietUpsertSchema) => {
      return apiClient.put<ApiResponseDto<DietDetailSchema>>(
        `/api/diet/${dietId}`,
        { body: payload },
      );
    },
  };
}
