import { type ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { apiClient } from '@/shared/api/apiClient.client';

interface SWRConfigProviderProps {
  children: ReactNode;
}

export type SWRKey = {
  url: `/${string}`;
  method?: 'GET' | 'POST';
  options?: any;
  date?: string;
};

export function SWRConfigProvider({ children }: SWRConfigProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (key: SWRKey) => {
          const { url, method = 'GET', options } = key;

          switch (method) {
            case 'POST':
              return apiClient.post(url, options);
            default:
              return apiClient.get(url, options);
          }
        },
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
        revalidateIfStale: true,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
