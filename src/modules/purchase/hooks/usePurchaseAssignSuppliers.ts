import { apiClient } from '@/shared/api/apiClient.client';
import type { PurchaseAssignSuppliersSchema } from '@/shared/types/schema';
export function usePurchaseAssignSuppliers(id: number) {
  return {
    trigger: (data: PurchaseAssignSuppliersSchema) =>
      apiClient.post(`/api/purchase/${id}/suppliers`, { body: data }),
  };
}
