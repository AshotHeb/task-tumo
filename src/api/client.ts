import axios, {
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import type { ApiResponse, ApiError } from "./types";
import { showErrorToast } from "./utils";

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Request interceptor
 * Add auth token or other headers before request is sent
 */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem("authToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor
 * Handle errors and transform responses
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    // Return data directly if wrapped in ApiResponse format
    return response;
  },
  (error) => {
    // Handle error responses
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.status_message ||
      error.message ||
      "An error occurred";

    const apiError: ApiError = {
      message: errorMessage,
      status: error.response?.status,
      errors: error.response?.data?.errors,
    };

    // Show error toast notification
    showErrorToast(errorMessage);

    // Handle specific status codes
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem("authToken");
      // Optionally redirect to login page
      // window.location.href = '/login';
    }

    return Promise.reject(apiError);
  }
);

export default apiClient;
