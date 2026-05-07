import type { ApiErrorDto } from '@/shared/types/schema';

const API_ERROR_FALLBACK = {
  type: 'INTERNAL_SERVER_ERROR',
  details: 'Request failed',
} satisfies Pick<ApiErrorDto, 'type' | 'details'>;

const API_ERROR_TYPES = new Set<ApiErrorDto['type']>([
  'BAD_REQUEST',
  'UNAUTHORIZED',
  'FORBIDDEN',
  'NOT_FOUND',
  'CONFLICT',
  'INTERNAL_SERVER_ERROR',
]);

function isApiErrorType(value: unknown): value is ApiErrorDto['type'] {
  return typeof value === 'string' && API_ERROR_TYPES.has(value as ApiErrorDto['type']);
}

export function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function getStringField(value: unknown, key: string): string | undefined {
  if (!isPlainObject(value)) {
    return undefined;
  }

  const field = value[key];
  return typeof field === 'string' ? field : undefined;
}

function getApiErrorType(value: unknown): ApiErrorDto['type'] | undefined {
  return isApiErrorType(value) ? value : undefined;
}

export async function parseJsonSafe(res: Response) {
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

export function getApiErrorDto(
  data: unknown,
  context: { status: number; url: string; statusText?: string },
): ApiErrorDto {
  if (isPlainObject(data) && isPlainObject(data.error)) {
    return getApiErrorDto(data.error, context);
  }

  const status =
    isPlainObject(data) && typeof data.status === 'number'
      ? data.status
      : context.status;

  return {
    status,
    url: getStringField(data, 'url') ?? context.url,
    type:
      getApiErrorType(getStringField(data, 'type')) ?? API_ERROR_FALLBACK.type,
    details:
      getStringField(data, 'details') ??
      getStringField(data, 'message') ??
      context.statusText ??
      API_ERROR_FALLBACK.details,
  };
}

export function createApiError(args: {
  error: ApiErrorDto;
  cause?: unknown;
}) {
  const error = new Error(args.error.details) as Error & ApiErrorDto;
  error.name = args.error.type;
  error.status = args.error.status;
  error.url = args.error.url;
  error.type = args.error.type;
  error.details = args.error.details;
  if (args.cause !== undefined) {
    error.cause = args.cause;
  }
  return error;
}

export function isApiErrorDto(error: unknown): error is Error & ApiErrorDto {
  return (
    error instanceof Error &&
    isPlainObject(error) &&
    getApiErrorType(error.type) !== undefined &&
    typeof error.details === 'string' &&
    typeof error.status === 'number' &&
    typeof error.url === 'string'
  );
}
