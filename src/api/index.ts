import apiClient from "./client";
import type { ApiResponse, RequestConfig } from "./types";
import type { AxiosResponse } from "axios";

/**
 * API Client instance
 * Use this in Pinia stores or components for making HTTP requests
 */
export { default as apiClient } from "./client";

/**
 * Export API types
 */
export type { ApiResponse, ApiError, RequestConfig } from "./types";

/**
 * Type-safe GET request
 * @param url - API endpoint
 * @param config - Request configuration (params, headers, etc.)
 * @returns Promise with typed response data
 */
export async function get<T = unknown>(
  url: string,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> {
  return apiClient.get<ApiResponse<T>>(url, config);
}

/**
 * Type-safe POST request
 * @param url - API endpoint
 * @param data - Request body data
 * @param config - Request configuration
 * @returns Promise with typed response data
 */
export async function post<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> {
  return apiClient.post<ApiResponse<T>>(url, data, config);
}

/**
 * Type-safe PUT request
 * @param url - API endpoint
 * @param data - Request body data
 * @param config - Request configuration
 * @returns Promise with typed response data
 */
export async function put<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> {
  return apiClient.put<ApiResponse<T>>(url, data, config);
}

/**
 * Type-safe PATCH request
 * @param url - API endpoint
 * @param data - Request body data
 * @param config - Request configuration
 * @returns Promise with typed response data
 */
export async function patch<T = unknown, D = unknown>(
  url: string,
  data?: D,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> {
  return apiClient.patch<ApiResponse<T>>(url, data, config);
}

/**
 * Type-safe DELETE request
 * @param url - API endpoint
 * @param config - Request configuration
 * @returns Promise with typed response data
 */
export async function del<T = unknown>(
  url: string,
  config?: RequestConfig
): Promise<AxiosResponse<ApiResponse<T>>> {
  return apiClient.delete<ApiResponse<T>>(url, config);
}

/**
 * Example usage in Pinia store:
 *
 * ```typescript
 * import { get, post } from '@/api';
 * import type { ApiResponse } from '@/api';
 *
 * // In a Pinia store action:
 * async function fetchUsers() {
 *   try {
 *     const response = await get<{ users: User[] }>('/users');
 *     users.value = response.data.data.users;
 *   } catch (error) {
 *     console.error('Failed to fetch users:', error);
 *   }
 * }
 *
 * async function createUser(userData: CreateUserDto) {
 *   try {
 *     const response = await post<{ user: User }>('/users', userData);
 *     users.value.push(response.data.data.user);
 *   } catch (error) {
 *     console.error('Failed to create user:', error);
 *   }
 * }
 * ```
 */
