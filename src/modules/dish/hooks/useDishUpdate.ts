import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DishPreviewSchema, DishUpsertSchema } from '@/shared/types/schema';

export function useDishUpdate() {
  return {
    trigger: async (id: number, payload: DishUpsertSchema) => {
      return apiClient.put<ApiResponseDto<DishPreviewSchema>>(
        `/api/dishes/${id}`,
        {
          body: payload,
        },
      );
    },
  };
}
