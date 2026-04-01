export default class ApiError extends Error {
  readonly status: number;
  readonly code?: string;
  readonly url: string;
  readonly details?: any;

  constructor(args: {
    message: string;
    status: number;
    url: string;
    code?: string;
    details?: any;
  }) {
    super(args.message);
    this.name = 'ApiError';
    this.status = args.status;
    this.code = args.code;
    this.url = args.url;
    this.details = args.details;
  }
}
