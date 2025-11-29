import type { Genre } from "@/api/entities/movies/types";

export const SEARCH_QUERY_PARAM = "search";

/**
 * localStorage key for cached genres
 */
export const GENRES_STORAGE_KEY = "movie-genres-cache";

/**
 * Get search value from URL query parameters
 */
export function getSearchFromUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(SEARCH_QUERY_PARAM) || "";
}

/**
 * Update search value in URL query parameters
 */
export function updateSearchInUrl(search: string): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (search) {
    url.searchParams.set(SEARCH_QUERY_PARAM, search);
  } else {
    url.searchParams.delete(SEARCH_QUERY_PARAM);
  }

  // Update URL without page reload
  window.history.replaceState({}, "", url.toString());
}

/**
 * Save genres to localStorage
 * @param genres - Array of genres to save
 */
export function saveGenresToStorage(genres: Genre[]): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(GENRES_STORAGE_KEY, JSON.stringify(genres));
  } catch (error) {
    console.error("Failed to save genres to localStorage:", error);
  }
}

/**
 * Load genres from localStorage
 * @returns Array of genres if found, empty array otherwise
 */
export function loadGenresFromStorage(): Genre[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = localStorage.getItem(GENRES_STORAGE_KEY);
    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);
    // Validate that parsed data is an array
    if (Array.isArray(parsed)) {
      return parsed;
    }

    return [];
  } catch (error) {
    console.error("Failed to load genres from localStorage:", error);
    return [];
  }
}
