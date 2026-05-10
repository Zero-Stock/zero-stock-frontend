import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { UpdatedCountResponseSchema } from '@/shared/types/schema';
import type { ProcurementUpdateDto } from '../dtos/procurementUpdate.dto';

export function useProcurementUpdate() {
  return {
    trigger: async (data: ProcurementUpdateDto) => {
      return apiClient.post<ApiResponseDto<UpdatedCountResponseSchema>>(
        '/api/procurement/items',
        {
        body: data,
        },
      );
    },
  };
}
