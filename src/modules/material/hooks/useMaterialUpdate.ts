import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  MaterialPreviewSchema,
  MaterialUpsertSchema,
} from '@/shared/types/schema';

type MaterialUpdatePayload = MaterialUpsertSchema & { id: number };

export function useMaterialUpdate() {
  return {
    trigger: async (data: MaterialUpdatePayload) => {
      const { id, ...body } = data;

      return apiClient.put<ApiResponseDto<MaterialPreviewSchema[]>>(
        `/api/materials/${id}`,
        {
          body,
        },
      );
    },
  };
}
