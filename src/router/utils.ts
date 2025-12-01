import { SEARCH_QUERY_PARAM, GENRES_QUERY_PARAM } from "@/stores/movies/utils";

/**
 * localStorage key for saved home page query params
 */
export const HOME_QUERY_PARAMS_STORAGE_KEY = "home-query-params";

/**
 * Saved query params structure
 */
export interface SavedQueryParams {
  search?: string;
  genres?: string;
}

/**
 * Save current query params to localStorage
 */
export function saveQueryParamsToStorage(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const urlParams = new URLSearchParams(window.location.search);
    const savedParams: SavedQueryParams = {};

    const search = urlParams.get(SEARCH_QUERY_PARAM);
    if (search) {
      savedParams.search = search;
    }

    const genres = urlParams.get(GENRES_QUERY_PARAM);
    if (genres) {
      savedParams.genres = genres;
    }

    // Only save if there are params to save
    if (Object.keys(savedParams).length > 0) {
      localStorage.setItem(
        HOME_QUERY_PARAMS_STORAGE_KEY,
        JSON.stringify(savedParams)
      );
    } else {
      // Remove from storage if no params
      localStorage.removeItem(HOME_QUERY_PARAMS_STORAGE_KEY);
    }
  } catch (error) {
    console.error("Failed to save query params to localStorage:", error);
  }
}

/**
 * Load saved query params from localStorage
 * @returns Saved query params if found, null otherwise
 */
export function loadQueryParamsFromStorage(): SavedQueryParams | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const stored = localStorage.getItem(HOME_QUERY_PARAMS_STORAGE_KEY);
    if (!stored) {
      return null;
    }

    const parsed = JSON.parse(stored);
    // Validate that parsed data is an object
    if (
      typeof parsed === "object" &&
      parsed !== null &&
      !Array.isArray(parsed)
    ) {
      return parsed;
    }

    return null;
  } catch (error) {
    console.error("Failed to load query params from localStorage:", error);
    return null;
  }
}

/**
 * Apply saved query params to URL if they don't already exist
 * @param savedParams - Saved query params from localStorage
 */
export function applyQueryParamsToUrl(savedParams: SavedQueryParams): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  let hasChanges = false;

  // Apply search param if it doesn't exist in URL
  if (savedParams.search && !url.searchParams.has(SEARCH_QUERY_PARAM)) {
    url.searchParams.set(SEARCH_QUERY_PARAM, savedParams.search);
    hasChanges = true;
  }

  // Apply genres param if it doesn't exist in URL
  if (savedParams.genres && !url.searchParams.has(GENRES_QUERY_PARAM)) {
    url.searchParams.set(GENRES_QUERY_PARAM, savedParams.genres);
    hasChanges = true;
  }

  // Update URL if there were changes
  if (hasChanges) {
    window.history.replaceState({}, "", url.toString());
  }
}

/**
 * Get restored query params from localStorage if URL doesn't already have them
 * @param currentQuery - Current route query params
 * @returns Query params object to use, or null if no restoration needed
 */
export function getRestoredQueryParams(
  currentQuery: Record<string, any>
): Record<string, string> | null {
  // Only restore if URL doesn't already have query params
  const hasExistingParams = currentQuery.search || currentQuery.genres;

  if (!hasExistingParams) {
    const savedParams = loadQueryParamsFromStorage();
    if (savedParams) {
      // Build query params object from saved params
      const query: Record<string, string> = {};
      if (savedParams.search) {
        query.search = savedParams.search;
      }
      if (savedParams.genres) {
        query.genres = savedParams.genres;
      }
      if (Object.keys(query).length > 0) {
        // Remove from localStorage after successful restoration
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem(HOME_QUERY_PARAMS_STORAGE_KEY);
          } catch (error) {
            console.error(
              "Failed to remove query params from localStorage:",
              error
            );
          }
        }
        return query;
      }
    }
  }

  return null;
}
