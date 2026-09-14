import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type { PurchasePreviewSchema } from '@/shared/types/schema';

export function usePurchaseRegenerate(id: number) {
  return {
    trigger: async () => {
      const response = await apiClient.post<
        ApiResponseDto<PurchasePreviewSchema>
      >(`/api/purchase/${id}/regenerate`, {});
      return response.result;
    },
  };
}
