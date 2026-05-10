import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { IdResponseSchema } from '@/shared/types/schema';

export function useDietCategoryDelete() {
  return {
    trigger: async (dietId: number) => {
      return apiClient.delete<ApiResponseDto<IdResponseSchema>>(
        `/api/diet/${dietId}`,
      );
    },
  };
}
