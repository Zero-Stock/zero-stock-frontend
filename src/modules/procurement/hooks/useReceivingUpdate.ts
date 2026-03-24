import { apiClient } from '@/shared/api/apiClient.client';
import type { ReceivingUpdateDto } from '../dtos/receivingUpdate.dto';

export function useReceivingUpdate() {
  return {
    trigger: async (data: ReceivingUpdateDto) => {
      return apiClient.post<ReceivingUpdateDto>('/api/receivings/batch/', {
        body: data,
      });
    },
  };
}
