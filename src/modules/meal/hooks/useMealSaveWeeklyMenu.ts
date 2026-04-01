import { apiClient } from '@/shared/api/apiClient.client';
import type { WeeklyMenuBatchItem } from '../dtos/menu.dto';

export function useMealSaveWeeklyMenu() {
  return {
    trigger: async (payload: WeeklyMenuBatchItem[]) => {
      return apiClient.post('/api/weekly-menus/batch/', {
        body: payload,
      });
    },
  };
}
