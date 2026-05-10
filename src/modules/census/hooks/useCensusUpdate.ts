import { apiClient } from '@/shared/api/apiClient.client';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  CensusUpsertSchema,
  DatedMutationCountResponseSchema,
} from '@/shared/types/schema';

export function useCensusUpdate() {
  const selectedDate = useDateStore((state) => state.date);

  return {
    trigger: async (data: CensusUpsertSchema) => {
      return apiClient.post<ApiResponseDto<DatedMutationCountResponseSchema>>(
        '/api/census',
        {
        body: {
          date: selectedDate,
          ...data,
        },
        },
      );
    },
  };
}
