export interface ApiResponseOptions {
  timestamp?: string;
  metadata?: Record<string, unknown>;
}

export class ApiResponse<T> {
  readonly success: boolean;
  readonly message: string;
  readonly data: T;
  readonly status: number;
  readonly timestamp: string;
  readonly metaData?: Record<string, unknown>;

  constructor(
    data: T,
    message = 'Success',
    status = 200,
    options: ApiResponseOptions = {},
  ) {
    this.success = true;
    this.message = message;
    this.data = data;
    this.status = status;
    this.timestamp = options.timestamp || new Date().toISOString();
    this.metaData = options.metadata;
  }

  static success<T>(
    data: T,
    message = 'Success',
    status = 200,
    options?: ApiResponseOptions,
  ) {
    return new ApiResponse(data, message, status, options);
  }

  static created<T>(
    data: T,
    message = 'Created',
    options?: ApiResponseOptions,
  ) {
    return new ApiResponse(data, message, 201, options);
  }

  static noContent(message = 'No content', options?: ApiResponseOptions) {
    return new ApiResponse(null, message, 204, options);
  }
}

export class PaginatedResponse<T> extends ApiResponse<T[]> {
  readonly pagination: {
    page: number;
    limit: number;
    totalPages: number;
    totalItems: number;
  };

  constructor(
    data: T[],
    pagination: {
      page: number;
      limit: number;
      totalPages: number;
      totalItems: number;
    },
    message = 'Success',
    options: ApiResponseOptions = {},
  ) {
    super(data, message, 200, options);
    this.pagination = pagination;
  }
}
