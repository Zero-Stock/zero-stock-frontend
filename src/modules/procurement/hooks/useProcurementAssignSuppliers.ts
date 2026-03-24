import { apiClient } from '@/shared/api/apiClient.client';

interface ProcurementAssignSupplierItemDto {
  item_id: number;
  supplier_material_id: number | null;
}

interface ProcurementAssignSuppliersDto {
  assignments: ProcurementAssignSupplierItemDto[];
}

export function useProcurementAssignSuppliers() {
  return {
    trigger: async (data: ProcurementAssignSuppliersDto) => {
      return apiClient.post('/api/procurement/assign-suppliers/', {
        body: data,
      });
    },
  };
}
