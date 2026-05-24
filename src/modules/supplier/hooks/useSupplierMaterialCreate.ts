import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  SupplierDetailSchema,
  SupplierMaterialUpsertSchema,
} from '@/shared/types/schema';

type SupplierMaterialCreatePayload = Omit<SupplierMaterialUpsertSchema, 'id'>;

export function useSupplierMaterialCreate() {
  return {
    trigger: async (supplierId: number, data: SupplierMaterialCreatePayload) => {
      const supplier = await apiClient.get<ApiResponseDto<SupplierDetailSchema>>(
        `/api/suppliers/${supplierId}`,
      );
      const current = supplier.result;

      return apiClient.patch<ApiResponseDto<SupplierDetailSchema>>(
        `/api/suppliers/${supplierId}`,
        {
          body: {
            name: current?.name,
            contact_person: current?.contact_person,
            phone: current?.phone,
            address: current?.address,
            materials: [data],
          },
        },
      );
    },
  };
}
