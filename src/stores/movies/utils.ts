import type { Genre, Movie } from "@/api/entities/movies/types";

export const SEARCH_QUERY_PARAM = "search";
export const GENRES_QUERY_PARAM = "genres";

/**
 * localStorage key for cached genres
 */
export const GENRES_STORAGE_KEY = "movie-genres-cache";

/**
 * localStorage key for cached movies listings by page
 */
export const MOVIES_LISTINGS_STORAGE_KEY = "movie-listings-cache";

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
 * Get genre IDs from URL query parameters
 * @returns Array of genre IDs parsed from comma-separated string
 */
export function getGenresFromUrl(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  const urlParams = new URLSearchParams(window.location.search);
  const genresParam = urlParams.get(GENRES_QUERY_PARAM);
  
  if (!genresParam) {
    return [];
  }

  // Parse comma-separated genre IDs
  const genreIds = genresParam
    .split(",")
    .map((id) => parseInt(id.trim(), 10))
    .filter((id) => !isNaN(id) && id > 0);

  return genreIds;
}

/**
 * Update genre IDs in URL query parameters
 * @param genreIds - Array of genre IDs to set in URL
 */
export function updateGenresInUrl(genreIds: number[]): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);

  if (genreIds.length > 0) {
    // Convert array to comma-separated string
    const genresString = genreIds.join(",");
    url.searchParams.set(GENRES_QUERY_PARAM, genresString);
  } else {
    url.searchParams.delete(GENRES_QUERY_PARAM);
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

/**
 * Cached movies response with page info
 */
interface CachedMoviesResponse {
  movies: Movie[];
  page: number;
  total_pages: number;
}

/**
 * Save movies listings to localStorage by page number
 * @param pageNumber - Page number
 * @param movies - Array of movies for that page
 * @param page - Current page number from API response
 * @param total_pages - Total pages from API response
 */
export function saveMoviesListingsToStorage(
  pageNumber: number,
  movies: Movie[],
  page: number,
  total_pages: number
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const cached = loadAllMoviesListingsFromStorage();
    cached[pageNumber] = {
      movies,
      page,
      total_pages,
    };
    localStorage.setItem(MOVIES_LISTINGS_STORAGE_KEY, JSON.stringify(cached));
  } catch (error) {
    console.error("Failed to save movies listings to localStorage:", error);
  }
}

/**
 * Load movies listings from localStorage by page number
 * @param pageNumber - Page number
 * @returns Cached movies response if found, undefined otherwise
 */
export function loadMoviesListingsFromStorage(
  pageNumber: number
): CachedMoviesResponse | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const cached = loadAllMoviesListingsFromStorage();
    return cached[pageNumber];
  } catch (error) {
    console.error("Failed to load movies listings from localStorage:", error);
    return undefined;
  }
}

/**
 * Load all cached movies listings from localStorage
 * @returns Record of cached movies listings (page number as key, CachedMoviesResponse as value), or empty object if not found
 */
export function loadAllMoviesListingsFromStorage(): Record<
  number,
  CachedMoviesResponse
> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(MOVIES_LISTINGS_STORAGE_KEY);
    if (!stored) {
      return {};
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

    return {};
  } catch (error) {
    console.error("Failed to load movies listings from localStorage:", error);
    return {};
  }
}
