import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierMaterialPreviewSchema,
  SupplierMaterialUpsertSchema,
} from '@/shared/types/schema';

type SupplierMaterialCreatePayload = Omit<SupplierMaterialUpsertSchema, 'id'>;

export function useSupplierMaterialCreate() {
  return {
    trigger: async (data: SupplierMaterialCreatePayload) => {
      return apiClient.post<ApiResponseDto<SupplierMaterialPreviewSchema>>(
        '/api/supplier-materials',
        {
          body: data,
        },
      );
    },
  };
}
