import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierPreviewSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';

export function useSupplierUpdate() {
  return {
    trigger: async (id: number, data: SupplierUpsertSchema) => {
      return apiClient.patch<ApiResponseDto<SupplierPreviewSchema>>(
        `/api/suppliers/${id}`,
        { body: data },
      );
    },
  };
}
