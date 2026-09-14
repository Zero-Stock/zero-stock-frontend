import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  PurchaseGenerateSchema,
  PurchaseRecordSchema,
} from '@/shared/types/schema';

export function usePurchaseGenerate() {
  return {
    trigger: async (data: Pick<PurchaseGenerateSchema, 'needed_date'>) => {
      const response = await apiClient.post<
        ApiResponseDto<PurchaseRecordSchema>
      >('/api/purchase/generate', {
        body: {
          company_id: 1,
          ...data,
        },
      });

      return response.result;
    },
  };
}
