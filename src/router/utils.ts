/**
 * localStorage key for saved previous URL before navigating to movie details
 */
export const PREVIOUS_URL_STORAGE_KEY = "previous-url";

/**
 * Save the current full URL to localStorage
 */
export function savePreviousUrl(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const fullUrl = window.location.href;
    localStorage.setItem(PREVIOUS_URL_STORAGE_KEY, fullUrl);
  } catch (error) {
    console.error("Failed to save previous URL to localStorage:", error);
  }
}

/**
 * Get the saved previous URL from localStorage
 * @returns Previous URL if found, null otherwise
 */
export function getPreviousUrl(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    return localStorage.getItem(PREVIOUS_URL_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to get previous URL from localStorage:", error);
    return null;
  }
}

/**
 * Remove the saved previous URL from localStorage
 */
export function removePreviousUrl(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(PREVIOUS_URL_STORAGE_KEY);
  } catch (error) {
    console.error("Failed to remove previous URL from localStorage:", error);
  }
}
