import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierPreviewSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';

export function useSupplierUpdate() {
  return {
    trigger: async (
      data: SupplierUpsertSchema & Required<Pick<SupplierUpsertSchema, 'id'>>,
    ) => {
      return apiClient.patch<ApiResponseDto<SupplierPreviewSchema>>(
        `/api/suppliers/${data.id}`,
        { body: data },
      );
    },
  };
}
