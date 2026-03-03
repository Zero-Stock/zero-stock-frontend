import { type ReactNode } from 'react';
import { SWRConfig } from 'swr';
import { authedApiClient } from '../api/apiClientAuthed.client';

interface SWRConfigProviderProps {
  children: ReactNode;
}

export function SWRConfigProvider({ children }: SWRConfigProviderProps) {
  return (
    <SWRConfig
      value={{
        fetcher: async ([path, options]: [any, any]) => {
          const response = await authedApiClient.get(path, options);
          return response;
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
