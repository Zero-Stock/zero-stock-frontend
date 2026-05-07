import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  MaterialResponseSchema,
  MaterialUpsertSchema,
} from '@/shared/types/schema';

type MaterialUpdatePayload = Omit<MaterialUpsertSchema, 'id'> & { id: number };

export function useMaterialUpdate() {
  return {
    trigger: async (data: MaterialUpdatePayload) => {
      return apiClient.put<ApiResponseDto<MaterialResponseSchema[]>>(
        `/api/materials/${data.id}`,
        {
          body: data,
        },
      );
    },
  };
}
