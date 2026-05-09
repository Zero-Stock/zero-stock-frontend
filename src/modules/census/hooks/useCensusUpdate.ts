import { apiClient } from '@/shared/api/apiClient.client';
import { useDateStore } from '@/shared/stores/dateStore';
import type { components } from '@/shared/types/schema';

export function useCensusUpdate() {
  const selectedDate = useDateStore((state) => state.date);

  return {
    trigger: async (data: components['schemas']['CensusUpsertSchema']) => {
      return apiClient.post<
        Omit<components['schemas']['ApiResponseDto'], 'result'> & {
          result: components['schemas']['DatedMutationCountResponseSchema'];
        }
      >('/api/census', {
        body: {
          date: selectedDate,
          ...data,
        },
      });
    },
  };
}
