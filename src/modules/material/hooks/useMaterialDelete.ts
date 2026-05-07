import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { IdResponseSchema } from '@/shared/types/schema';

export function useMaterialDelete() {
  return {
    trigger: async (id: number) => {
      return apiClient.delete<ApiResponseDto<IdResponseSchema>>(
        `/api/materials/${id}`,
      );
    },
  };
}
