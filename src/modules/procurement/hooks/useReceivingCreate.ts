import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  DatedMutationCountResponseSchema,
  ReceivingUpsertSchema,
} from '@/shared/types/schema';

export function useReceivingCreate() {
  return {
    trigger: async (data: ReceivingUpsertSchema) => {
      return apiClient.post<ApiResponseDto<DatedMutationCountResponseSchema>>(
        '/api/receiving',
        {
          body: data,
        },
      );
    },
  };
}
