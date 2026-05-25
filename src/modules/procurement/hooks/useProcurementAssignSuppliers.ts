import { apiClient } from '@/shared/api/apiClient.client';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ProcurementAssignSuppliersSchema } from '@/shared/types/schema';

export function useProcurementAssignSuppliers() {
  const selectedDate = useDateStore((state) => state.date);

  return {
    trigger: async (
      data: Pick<ProcurementAssignSuppliersSchema, 'assignments'>,
    ) => {
      return apiClient.post('/api/procurement/assign-suppliers', {
        body: {
          date: selectedDate,
          assignments: data.assignments,
        },
      });
    },
  };
}
