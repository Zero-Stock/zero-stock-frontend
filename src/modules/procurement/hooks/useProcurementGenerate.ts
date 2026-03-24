import { apiClient } from '@/shared/api/apiClient.client';

interface ProcurementGenerateDto {
  date: string;
  company: number;
}

interface ProcurementGenerateResponseDto {
  id: number;
  target_date: string;
  status: string;
}

export function useProcurementGenerate() {
  return {
    trigger: async (data: Omit<ProcurementGenerateDto, 'company'>) => {
      return apiClient.post<ProcurementGenerateResponseDto>(
        '/api/procurement/generate/',
        {
          body: {
            company: 1,
            ...data,
          },
        },
      );
    },
  };
}
