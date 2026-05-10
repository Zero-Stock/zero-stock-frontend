import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { UpdatedCountResponseSchema } from '@/shared/types/schema';
import type { ReceivingUpdateDto } from '../dtos/receivingUpdate.dto';

export function useReceivingUpdate() {
  return {
    trigger: async (data: ReceivingUpdateDto) => {
      return apiClient.post<ApiResponseDto<UpdatedCountResponseSchema>>(
        '/api/receiving/items',
        {
        body: data,
        },
      );
    },
  };
}
