import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DishPreviewSchema, DishUpsertSchema } from '@/shared/types/schema';

export function useDishCreate() {
  return {
    trigger: async (payload: DishUpsertSchema) => {
      return apiClient.post<ApiResponseDto<DishPreviewSchema>>('/api/dishes', {
        body: payload,
      });
    },
  };
}
