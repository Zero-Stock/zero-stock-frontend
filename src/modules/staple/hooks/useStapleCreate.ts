import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  StaplePreviewSchema,
  StapleUpsertSchema,
} from '@/shared/types/schema';

export function useStapleCreate() {
  return {
    trigger: async (payload: StapleUpsertSchema) => {
      return apiClient.post<ApiResponseDto<StaplePreviewSchema>>(
        '/api/staples',
        {
          body: payload,
        },
      );
    },
  };
}
