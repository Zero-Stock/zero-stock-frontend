import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierMaterialPreviewSchema,
  SupplierMaterialUpsertSchema,
} from '@/shared/types/schema';

type SupplierMaterialUpdatePayload = SupplierMaterialUpsertSchema &
  Required<Pick<SupplierMaterialUpsertSchema, 'id'>>;

export function useSupplierMaterialUpdate() {
  return {
    trigger: async (data: SupplierMaterialUpdatePayload) => {
      const { id, ...body } = data;

      return apiClient.patch<ApiResponseDto<SupplierMaterialPreviewSchema>>(
        `/api/supplier-materials/${id}`,
        {
          body,
        },
      );
    },
  };
}
