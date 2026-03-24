import { apiClient } from '@/shared/api/apiClient.client';

interface ProcurementGenerateDto {
  date: string;
}

interface ProcurementGenerateResponseDto {
  id: number;
  target_date: string;
  status: string;
}

export function useProcurementGenerate() {
  return {
    trigger: async (data: ProcurementGenerateDto) => {
      return apiClient.post<ProcurementGenerateResponseDto>(
        '/api/procurement/generate/',
        {
          body: data,
        },
      );
    },
  };
}
