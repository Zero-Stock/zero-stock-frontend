import { apiClient } from '@/shared/api/apiClient.client';

interface ReceivingCreateItemDto {
  raw_material_id: number;
  actual_quantity: number;
  notes?: string;
}

interface ReceivingCreateDto {
  procurement_id: number;
  notes?: string;
  items: ReceivingCreateItemDto[];
}

export function useReceivingCreate() {
  return {
    trigger: async (data: ReceivingCreateDto) => {
      return apiClient.post('/api/receiving/', {
        body: data,
      });
    },
  };
}
