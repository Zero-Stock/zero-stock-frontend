import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';
import type {
  CensusBatchResultDto,
  CensusCreateDto,
} from '../dtos/censusCreate.dto';

export function useCensusCreate() {
  return {
    trigger: async (data: CensusCreateDto) => {
      const { date, items } = data;

      return apiClient.post<ApiResponseDto<CensusBatchResultDto>>(
        '/api/census/batch/',
        {
          body: { date, items },
        },
      );
    },
  };
}
