/**
 * API response wrapper type
 */
export interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status?: number;
}

/**
 * API error response type
 */
export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string[]>;
}

/**
 * HTTP method types
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/**
 * Request configuration type
 */
export interface RequestConfig {
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  timeout?: number;
}

