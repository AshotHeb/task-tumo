import { useGlobalStore } from "@/stores/global";

/**
 * Show error toast notification
 * @param message - Error message to display
 */
export function showErrorToast(message: string): void {
  try {
    const globalStore = useGlobalStore();
    globalStore.setActiveToast({
      title: "Error",
      description: message,
      variant: "error",
    });
  } catch (error) {
    // Fallback if store is not available (e.g., during SSR or initialization)
    console.error("Failed to show error toast:", error);
  }
}

/**
 * Extract error message from axios error
 * @param error - Error object (can be axios error or any error)
 * @returns Error message string
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === "string") {
    return error;
  }

  if (error && typeof error === "object") {
    // Axios error
    if ("response" in error && error.response) {
      const axiosError = error as { response: { data?: { message?: string } } };
      return (
        axiosError.response.data?.message ||
        "An error occurred while processing your request"
      );
    }

    // Error with message property
    if ("message" in error && typeof error.message === "string") {
      return error.message;
    }
  }

  return "An unexpected error occurred";
}
