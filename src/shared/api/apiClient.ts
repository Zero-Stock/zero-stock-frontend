import qs from 'qs';
import { getSelectedDate } from '@/shared/stores/dateStore';
import {
  createApiError,
  getApiErrorDto,
  isApiErrorDto,
  isPlainObject,
  parseJsonSafe,
} from '@/shared/utils/api';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type Query = Record<string, unknown>;

export interface RequestOptions {
  query?: Query;
  body?: unknown;
  formData?: FormData;
  headers?: HeadersInit;
  cache?: RequestCache;
  next?: { revalidate?: false | 0 | number; tags?: string[] };
  credentials?: RequestCredentials;
  timeoutMs?: number;
}

export interface ApiClientConfig {
  defaultHeaders?: HeadersInit;
  defaultCredentials?: RequestCredentials;
  defaultTimeoutMs?: number;
  getDynamicHeaders?: () => Promise<HeadersInit> | HeadersInit;
}

function resolveBaseUrl(): string {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl) {
    return envUrl.replace(/\/+$/, '');
  }

  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    return `http://${hostname}:3000`;
  }

  throw new Error('Unable to resolve base URL');
}
const BASE_URL = resolveBaseUrl();

function buildUrl(path: string, query?: Query) {
  let url = `${BASE_URL}${path}`;

  if (query && Object.keys(query).length > 0) {
    const q = qs.stringify(query, {
      arrayFormat: 'repeat',
      skipNulls: true,
    });
    if (q) {
      url += url.includes('?') ? `&${q}` : `?${q}`;
    }
  }

  return url;
}

function withSelectedDateBody(body: unknown) {
  if (!isPlainObject(body) || body.date) {
    return body;
  }

  return {
    ...body,
    date: getSelectedDate(),
  };
}

export class ApiClient {
  private readonly config: ApiClientConfig;

  constructor(config: ApiClientConfig = {}) {
    this.config = config;
  }

  get<T>(path: `/${string}`, options?: Omit<RequestOptions, 'formData'>) {
    return this.request<T>('GET', path, options);
  }

  delete<T>(
    path: `/${string}`,
    options?: Omit<RequestOptions, 'body' | 'formData'>,
  ) {
    return this.request<T>('DELETE', path, options);
  }

  post<T>(path: `/${string}`, options?: RequestOptions) {
    return this.request<T>('POST', path, options);
  }

  put<T>(path: `/${string}`, options?: RequestOptions) {
    return this.request<T>('PUT', path, options);
  }

  patch<T>(path: `/${string}`, options?: RequestOptions) {
    return this.request<T>('PATCH', path, options);
  }

  private async request<T>(
    method: HttpMethod,
    path: `/${string}`,
    options?: RequestOptions,
  ): Promise<T> {
    const {
      query,
      body,
      formData,
      headers,
      cache,
      next,
      credentials,
      timeoutMs,
    } = options ?? {};

    const url = buildUrl(path, query);

    // timeout
    const controller = new AbortController();
    const ms = timeoutMs ?? this.config.defaultTimeoutMs ?? 15000;
    const timer = setTimeout(() => controller.abort(), ms);

    // static headers
    const finalHeaders = new Headers(this.config.defaultHeaders);
    // dynamic headers
    if (this.config.getDynamicHeaders) {
      const dynamic = await this.config.getDynamicHeaders();
      new Headers(dynamic).forEach((v, k) => finalHeaders.set(k, v));
    }
    // request headers
    if (headers) {
      new Headers(headers).forEach((v, k) => finalHeaders.set(k, v));
    }

    // body
    let requestBody: BodyInit | undefined;

    if (method !== 'GET' && method !== 'DELETE') {
      if (formData) {
        requestBody = formData;
        finalHeaders.delete('Content-Type');
      } else if (body !== undefined) {
        requestBody = JSON.stringify(withSelectedDateBody(body));
        if (!finalHeaders.has('Content-Type')) {
          finalHeaders.set('Content-Type', 'application/json');
        }
      }
    }

    try {
      const res = await fetch(url, {
        method,
        headers: finalHeaders,
        body: requestBody,
        credentials: credentials ?? this.config.defaultCredentials ?? 'include',
        cache,
        next,
        signal: controller.signal,
      } as RequestInit);

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        throw createApiError({
          error: getApiErrorDto(data, {
            status: res.status,
            url,
            statusText: res.statusText || undefined,
          }),
        });
      }

      return data as T;
    } catch (err: Error | unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw createApiError({
          error: {
            status: 0,
            url,
            type: 'TIMEOUT',
            details: `Request timeout after ${ms}ms`,
          },
        });
      }

      if (isApiErrorDto(err)) throw err;

      throw createApiError({
        cause: err,
        error: {
          status: 0,
          url,
          type: 'NETWORK_ERROR',
          details: err instanceof Error ? err.message : 'Network error',
        },
      });
    } finally {
      clearTimeout(timer);
    }
  }
}
