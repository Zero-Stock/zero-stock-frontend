import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  DietDetailSchema,
  DietMealSlotUpsertSchema,
} from '@/shared/types/schema';

export function useDietSaveWeeklyMenu() {
  return {
    trigger: async (dietId: number, payload: DietMealSlotUpsertSchema[]) => {
      return apiClient.put<ApiResponseDto<DietDetailSchema>>(
        `/api/diet/${dietId}/meal-slots`,
        { body: payload },
      );
    },
  };
}
