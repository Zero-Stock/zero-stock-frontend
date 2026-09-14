import { apiClient } from '@/shared/api/apiClient.client';

export function usePurchaseSubmit() {
  return {
    trigger: async (purchaseId: number) => {
      return apiClient.post(`/api/purchase/${purchaseId}/submit`, {});
    },
  };
}
