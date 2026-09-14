import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  ProcurementGenerateSchema,
  ProcurementRecordSchema,
} from '@/shared/types/schema';

export function useProcurementGenerate() {
  return {
    trigger: async (data: Pick<ProcurementGenerateSchema, 'needed_date'>) => {
      const response = await apiClient.post<
        ApiResponseDto<ProcurementRecordSchema>
      >('/api/procurement/generate', {
        body: {
          company_id: 1,
          ...data,
        },
      });

      return response.result;
    },
  };
}
