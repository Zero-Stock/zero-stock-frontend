import { apiClient } from '@/shared/api/apiClient.client';
import type { ProcurementUpdateDto } from '../dtos/procurementUpdate.dto';

export function useProcurementUpdate() {
  return {
    trigger: async (data: ProcurementUpdateDto) => {
      return apiClient.post<ProcurementUpdateDto>('/api/procurements/batch/', {
        body: data,
      });
    },
  };
}
