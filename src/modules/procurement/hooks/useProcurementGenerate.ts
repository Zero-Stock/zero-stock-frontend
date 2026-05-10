import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { ProcurementRecordSchema } from '@/shared/types/schema';

interface ProcurementGenerateDto {
  date: string;
}

export function useProcurementGenerate() {
  return {
    trigger: async (data: ProcurementGenerateDto) => {
      const response = await apiClient.post<
        ApiResponseDto<ProcurementRecordSchema>
      >('/api/procurement', {
        body: {
          company_id: 1,
          ...data,
        },
      });

      return response.result;
    },
  };
}
