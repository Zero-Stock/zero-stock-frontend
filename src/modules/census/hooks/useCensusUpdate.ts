import { apiClient } from '@/shared/api/apiClient.client';
import type { CensusBatchResultDto } from '../dtos/censusCreate.dto';
import type { CensusUpdateDto } from '../dtos/censusUpdate.dto';

export function useCensusUpdate() {
  return {
    trigger: async (data: CensusUpdateDto) => {
      return apiClient.post<CensusBatchResultDto>('/api/census/batch/', {
        body: data,
      });
    },
  };
}
