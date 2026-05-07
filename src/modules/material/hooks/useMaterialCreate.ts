import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  MaterialResponseSchema,
  MaterialUpsertSchema,
} from '@/shared/types/schema';

export function useMaterialCreate() {
  return {
    trigger: async (payload: MaterialUpsertSchema[]) => {
      return apiClient.post<ApiResponseDto<MaterialResponseSchema[]>>(
        '/api/materials',
        {
          body: payload,
        },
      );
    },
  };
}
