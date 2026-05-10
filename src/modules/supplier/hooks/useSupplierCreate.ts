import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierPreviewSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';

type SupplierCreatePayload = Omit<SupplierUpsertSchema, 'id'>;

export function useSupplierCreate() {
  return {
    trigger: async (data: SupplierCreatePayload) => {
      return apiClient.post<ApiResponseDto<SupplierPreviewSchema>>(
        '/api/suppliers',
        { body: data },
      );
    },
  };
}
