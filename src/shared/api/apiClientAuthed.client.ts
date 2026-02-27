import ApiError from './apiError';
import type { RequestOptions } from './apiClient';
import { tokenStore } from './tokenStore';
import { apiClient } from './apiClient.client';

export type RefreshResult = { accessToken: string; expiresAt?: number };
type ReadOptions = Omit<RequestOptions, 'body' | 'formData'>;

let inflight: Promise<RefreshResult> | null = null;

export async function refreshAccessToken(): Promise<RefreshResult> {
  if (!inflight) {
    inflight = (async () => {
      try {
        const data = await apiClient.post<RefreshResult>('/auth/refresh', {
          body: {},
          credentials: 'include',
        });

        tokenStore.set({
          accessToken: data.accessToken,
          expiresAt: data.expiresAt ?? null,
        });

        return data;
      } catch (e) {
        tokenStore.clear();
        throw e;
      } finally {
        inflight = null;
      }
    })();
  }
  return inflight;
}

function is401(e: unknown) {
  return e instanceof ApiError && e.status === 401;
}

async function withAuthRetry<T>(
  apiFn: () => Promise<T>,
  retryAfterRefresh?: boolean,
): Promise<T> {
  try {
    return await apiFn();
  } catch (e) {
    if (is401(e)) {
      await refreshAccessToken();
      if (retryAfterRefresh) {
        return await apiFn();
      }
    }
    throw e;
  }
}

export const authedApiClient = {
  get: <T>(path: `/${string}`, options?: ReadOptions) =>
    withAuthRetry(() => apiClient.get<T>(path, options), true),
  delete: <T>(path: `/${string}`, options?: ReadOptions) =>
    withAuthRetry(() => apiClient.delete<T>(path, options)),
  post: <T>(path: `/${string}`, options?: RequestOptions) =>
    withAuthRetry(() => apiClient.post<T>(path, options)),
  put: <T>(path: `/${string}`, options?: RequestOptions) =>
    withAuthRetry(() => apiClient.put<T>(path, options)),
  patch: <T>(path: `/${string}`, options?: RequestOptions) =>
    withAuthRetry(() => apiClient.patch<T>(path, options)),
};
