import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  ReceivingUpdateSchema,
  UpdatedCountResponseSchema,
} from '@/shared/types/schema';

export function useReceivingUpdate() {
  return {
    trigger: async (data: ReceivingUpdateSchema) => {
      return apiClient.post<ApiResponseDto<UpdatedCountResponseSchema>>(
        '/api/receiving/items',
        {
          body: data,
        },
      );
    },
  };
}
