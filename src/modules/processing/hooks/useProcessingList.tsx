import useSWR from 'swr';
import type { SWRKey } from '@/shared/providers/SWRConfigProvider';
import { useDateStore } from '@/shared/stores/dateStore';
import type { ProcessingItemDto } from '../dtos/processingItem.dto';
import type { ApiResponseDto } from '@/shared/dtos/apiResponse.dto';

export interface ProcessingListPayload {
  date: string;
  material_id?: number;
}

export function useProcessingList(
  payload?: Pick<ProcessingListPayload, 'material_id'>,
) {
  const selectedDate = useDateStore((state) => state.date);

  const key: SWRKey = {
    url: '/api/processing/search/',
    method: 'POST',
    date: selectedDate,
    options: {
      body: {
        date: selectedDate,
        ...payload,
      },
    },
  };

  const { data, error, isLoading, mutate } =
    useSWR<ApiResponseDto<ProcessingItemDto[]>>(key);

  return {
    items: data?.results ?? [],
    isLoading,
    isError: error,
    mutate,
  };
}
