import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierMaterialPreviewSchema,
  SupplierMaterialUpsertSchema,
} from '@/shared/types/schema';

export function useSupplierMaterialCreate() {
  return {
    trigger: async (data: SupplierMaterialUpsertSchema) => {
      return apiClient.post<ApiResponseDto<SupplierMaterialPreviewSchema>>(
        '/api/supplier-materials',
        {
          body: data,
        },
      );
    },
  };
}
