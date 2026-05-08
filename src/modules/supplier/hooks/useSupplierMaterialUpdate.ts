import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierMaterialPreviewSchema,
  SupplierMaterialUpsertSchema,
} from '@/shared/types/schema';

export function useSupplierMaterialUpdate() {
  return {
    trigger: async (
      data: SupplierMaterialUpsertSchema &
        Required<Pick<SupplierMaterialUpsertSchema, 'id'>>,
    ) => {
      return apiClient.patch<ApiResponseDto<SupplierMaterialPreviewSchema>>(
        `/api/supplier-materials/${data.id}`,
        {
          body: data,
        },
      );
    },
  };
}
