import { apiClient } from '@/shared/api/apiClient.client';

interface ProcurementAssignSupplierItemDto {
  item_id: number;
  supplier_material_id: number | null;
}

interface ProcurementAssignSuppliersDto {
  date: string;
  assignments: ProcurementAssignSupplierItemDto[];
}

export function useProcurementAssignSuppliers() {
  return {
    trigger: async (data: ProcurementAssignSuppliersDto) => {
      return apiClient.post(
        `/api/procurement/assign-suppliers/?date=${data.date}`,
        {
          body: {
            assignments: data.assignments,
          },
        },
      );
    },
  };
}
