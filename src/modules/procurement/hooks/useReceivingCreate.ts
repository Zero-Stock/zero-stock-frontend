import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { DatedMutationCountResponseSchema } from '@/shared/types/schema';

interface ReceivingCreateItemDto {
  material_id: number;
  actual_quantity: number;
  notes?: string;
}

interface ReceivingCreateDto {
  procurement_id: number;
  notes?: string;
  items: ReceivingCreateItemDto[];
}

export function useReceivingCreate() {
  return {
    trigger: async (data: ReceivingCreateDto) => {
      return apiClient.post<ApiResponseDto<DatedMutationCountResponseSchema>>(
        '/api/receiving',
        {
        body: data,
        },
      );
    },
  };
}
