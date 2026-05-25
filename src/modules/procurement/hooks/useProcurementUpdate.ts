import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  ProcurementAssignSuppliersSchema,
  UpdatedCountResponseSchema,
} from '@/shared/types/schema';

export function useProcurementUpdate() {
  return {
    trigger: async (
      data: Pick<ProcurementAssignSuppliersSchema, 'date' | 'assignments'>,
    ) => {
      return apiClient.post<ApiResponseDto<UpdatedCountResponseSchema>>(
        '/api/procurement/items',
        {
          body: data,
        },
      );
    },
  };
}
