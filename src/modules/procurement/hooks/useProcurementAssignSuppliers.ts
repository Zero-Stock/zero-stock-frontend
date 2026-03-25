import { apiClient } from '@/shared/api/apiClient.client';
import { useDateStore } from '@/shared/stores/dateStore';

interface ProcurementAssignSupplierItemDto {
  item_id: number;
  supplier_material_id: number | null;
}

interface ProcurementAssignSuppliersDto {
  assignments: ProcurementAssignSupplierItemDto[];
}

export function useProcurementAssignSuppliers() {
  const selectedDate = useDateStore((state) => state.date);

  return {
    trigger: async (data: ProcurementAssignSuppliersDto) => {
      return apiClient.post(
        `/api/procurement/assign-suppliers/?date=${selectedDate}`,
        {
          body: {
            assignments: data.assignments,
          },
        },
      );
    },
  };
}
