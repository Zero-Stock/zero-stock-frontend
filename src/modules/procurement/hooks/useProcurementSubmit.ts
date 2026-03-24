import { apiClient } from '@/shared/api/apiClient.client';

export function useProcurementSubmit() {
  return {
    trigger: async (procurementId: number) => {
      return apiClient.post(`/api/procurement/${procurementId}/submit/`, {});
    },
  };
}
