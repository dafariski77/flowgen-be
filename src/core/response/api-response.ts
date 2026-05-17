export interface ApiMeta {
  code: number;
  message: string;
}

export interface ApiResponse<T = unknown> {
  meta: ApiMeta;
  data: T;
  error: string | null;
}

/**
 * Helper to build a success response.
 */
export function successResponse<T>(
  data: T,
  message: string = "Success",
  code: number = 200,
): ApiResponse<T> {
  return {
    meta: { code, message },
    data,
    error: null,
  };
}

/**
 * Helper to build an error response.
 */
export function errorResponse(
  error: string,
  code: number = 500,
  message: string = "Error",
): ApiResponse<null> {
  return {
    meta: { code, message },
    data: null,
    error,
  };
}
