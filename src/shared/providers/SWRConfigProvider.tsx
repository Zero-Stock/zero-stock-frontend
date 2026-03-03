import { type ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { authedApiClient } from '../api/apiClientAuthed.client';

interface SWRConfigProviderProps {
  children: ReactNode;
}

export type SWRKey = {
  url: `/${string}`;
  method?: 'GET' | 'POST';
  options?: any;
};

export function SWRConfigProvider({ children }: SWRConfigProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async (key: SWRKey) => {
          const { url, method = 'GET', options } = key;

          switch (method) {
            case 'POST':
              return authedApiClient.post(url, options);
            default:
              return authedApiClient.get(url, options);
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
