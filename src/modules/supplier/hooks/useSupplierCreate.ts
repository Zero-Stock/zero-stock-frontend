import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierPreviewSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';

export function useSupplierCreate() {
  return {
    trigger: async (data: SupplierUpsertSchema) => {
      return apiClient.post<ApiResponseDto<SupplierPreviewSchema>>(
        '/api/suppliers',
        { body: data },
      );
    },
  };
}
