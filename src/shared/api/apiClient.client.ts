import { ApiClient } from './apiClient';
import { tokenStore } from './tokenStore';

export const apiClient = new ApiClient({
  defaultCredentials: 'include',
  getDynamicHeaders: (): HeadersInit => {
    const { accessToken } = tokenStore.get();
    return accessToken ? { Authorization: `Bearer ${accessToken}` } : {};
  },
});
