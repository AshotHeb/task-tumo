import type { Movie } from "@/api/entities/movies/types";

/**
 * localStorage key for favorites
 */
export const FAVORITES_STORAGE_KEY = "movie-favorites";

/**
 * Save favorites to localStorage
 * @param favorites - Record of favorite movies (ID as key, Movie as value)
 */
export function saveFavoritesToStorage(
  favorites: Record<number, Movie>
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
  } catch (error) {
    console.error("Failed to save favorites to localStorage:", error);
  }
}

/**
 * Load favorites from localStorage
 * @returns Record of favorite movies (ID as key, Movie as value), or empty object if not found
 */
export function loadFavoritesFromStorage(): Record<number, Movie> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);
    // Validate that parsed data is an object
    if (typeof parsed === "object" && parsed !== null && !Array.isArray(parsed)) {
      return parsed;
    }

    return {};
  } catch (error) {
    console.error("Failed to load favorites from localStorage:", error);
    return {};
  }
}

