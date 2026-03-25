import { apiClient } from '@/shared/api/apiClient.client';

interface ProcessingGenerateDto {
  date: string;
}

interface ProcessingGenerateResponseDto {
  id: number;
  target_date: string;
  status: string;
}

export function useProcessingGenerate() {
  return {
    trigger: async (data: ProcessingGenerateDto) => {
      return apiClient.post<ProcessingGenerateResponseDto>(
        '/api/processing/generate/',
        {
          body: {
            ...data,
          },
        },
      );
    },
  };
}
