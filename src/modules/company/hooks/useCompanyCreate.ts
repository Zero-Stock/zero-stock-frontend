import { apiClient } from '@/shared/api/apiClient.client';
import type { ApiResponseDto } from '@/shared/types/apiResponse.dto';
import type {
  CompanyDetailSchema,
  CompanyUpsertSchema,
} from '@/shared/types/schema';

export function useCompanyCreate() {
  return {
    trigger: async (data: CompanyUpsertSchema) => {
      return apiClient.post<ApiResponseDto<CompanyDetailSchema>>(
        '/api/companies',
        { body: data },
      );
    },
  };
}
