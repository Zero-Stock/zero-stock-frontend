import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { ProcessingOrderSchema } from '@/shared/types/schema';

interface ProcessingGenerateDto {
  date: string;
}

export function useProcessingGenerate() {
  return {
    trigger: async (data: ProcessingGenerateDto) => {
      const response = await apiClient.post<
        ApiResponseDto<ProcessingOrderSchema>
      >('/api/processing', {
        body: {
          company_id: 1,
          ...data,
        },
      });

      return response.result;
    },
  };
}
