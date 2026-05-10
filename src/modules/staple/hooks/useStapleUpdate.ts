import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  StaplePreviewSchema,
  StapleUpsertSchema,
} from '@/shared/types/schema';

export function useStapleUpdate() {
  return {
    trigger: async (id: number, payload: StapleUpsertSchema) => {
      return apiClient.put<ApiResponseDto<StaplePreviewSchema>>(
        `/api/staples/${id}`,
        {
          body: payload,
        },
      );
    },
  };
}
