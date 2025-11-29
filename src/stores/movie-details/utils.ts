import type { MovieDetails } from "@/api/entities/movies/types";

/**
 * localStorage key for cached movie details
 */
export const MOVIE_DETAILS_STORAGE_KEY = "movie-details-cache";

/**
 * Save movie details to localStorage
 * @param movieId - Movie ID
 * @param movieDetails - Movie details to save
 */
export function saveMovieToStorage(
  movieId: number,
  movieDetails: MovieDetails
): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const cached = loadAllMoviesFromStorage();
    cached[movieId] = movieDetails;
    localStorage.setItem(
      MOVIE_DETAILS_STORAGE_KEY,
      JSON.stringify(cached)
    );
  } catch (error) {
    console.error("Failed to save movie details to localStorage:", error);
  }
}

/**
 * Load movie details from localStorage by ID
 * @param movieId - Movie ID
 * @returns Movie details if found, undefined otherwise
 */
export function loadMovieFromStorage(
  movieId: number
): MovieDetails | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  try {
    const cached = loadAllMoviesFromStorage();
    return cached[movieId];
  } catch (error) {
    console.error("Failed to load movie details from localStorage:", error);
    return undefined;
  }
}

/**
 * Load all cached movies from localStorage
 * @returns Record of cached movies (ID as key, MovieDetails as value), or empty object if not found
 */
export function loadAllMoviesFromStorage(): Record<number, MovieDetails> {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = localStorage.getItem(MOVIE_DETAILS_STORAGE_KEY);
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
    console.error("Failed to load movie details from localStorage:", error);
    return {};
  }
}

/**
 * Check if movie exists in localStorage
 * @param movieId - Movie ID
 * @returns True if movie exists in localStorage, false otherwise
 */
export function isMovieInStorage(movieId: number): boolean {
  const movie = loadMovieFromStorage(movieId);
  return movie !== undefined;
}

