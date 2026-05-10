import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierPreviewSchema,
  SupplierUpsertSchema,
} from '@/shared/types/schema';

type SupplierUpdatePayload = SupplierUpsertSchema &
  Required<Pick<SupplierUpsertSchema, 'id'>>;

export function useSupplierUpdate() {
  return {
    trigger: async (data: SupplierUpdatePayload) => {
      const { id, ...body } = data;

      return apiClient.patch<ApiResponseDto<SupplierPreviewSchema>>(
        `/api/suppliers/${id}`,
        { body },
      );
    },
  };
}
