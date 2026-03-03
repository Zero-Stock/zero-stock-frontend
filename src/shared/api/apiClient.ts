import qs from 'qs';
import ApiError from './apiError';

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
    return envUrl;
  }

  if (import.meta.env.DEV) {
    const hostname = window.location.hostname;
    return `http://${hostname}:8000`;
  }

  throw new Error('Unable to resolve base URL');
}
const BASE_URL = resolveBaseUrl();

function buildUrl(path: string, query?: Query) {
  let url = `${BASE_URL}${path}`;

  if (query && Object.keys(query).length > 0) {
    const q = qs.stringify(query, {
      arrayFormat: 'brackets',
      skipNulls: true,
    });
    if (q) url += `?${q}`;
  }

  return url;
}

async function parseJsonSafe(res: Response) {
  const ct = res.headers.get('content-type') || '';

  if (ct.includes('application/json')) {
    try {
      return await res.json();
    } catch {
      return null;
    }
  }

  const text = await res.text().catch(() => '');
  try {
    return JSON.parse(text);
  } catch {
    return text || null;
  }
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
        requestBody = JSON.stringify(body);
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
        const errorDetails = data?.error?.details || data;
        throw new ApiError({
<<<<<<< HEAD
          message: data?.message,
          status: res.status,
          url,
          code: data?.error?.type,
          details: data.error ?? data,
=======
          message:
            data?.error?.details?.message ||
            data?.error?.details?.detail ||
            data?.message ||
            errorDetails?.error ||
            `Request failed with status ${res.status}`,
          status: res.status,
          url,
          code: data?.error?.type || data?.code,
          details: errorDetails,
>>>>>>> 46efce9 (fix: update apiClient to align with backend)
        });
      }

      // Automatically unwrap the standard backend envelope { message, error, results }
      if (data && typeof data === 'object' && 'message' in data && 'error' in data && 'results' in data) {
        return data.results as T;
      }

      return data as T;
    } catch (err: ApiError | Error | unknown) {
      if (err instanceof Error && err.name === 'AbortError') {
        throw new ApiError({
          message: `Request timeout after ${ms}ms`,
          status: 0,
          url,
          code: 'TIMEOUT',
        });
      }

      if (err instanceof ApiError) throw err;

      throw new ApiError({
        message: err instanceof Error ? err.message : 'Network error',
        status: 0,
        url,
        code: 'NETWORK_ERROR',
        details: err,
      });
    } finally {
      clearTimeout(timer);
    }
  }
}
