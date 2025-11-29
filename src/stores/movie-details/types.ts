import type { MovieDetails } from "@/api/entities/movies/types";

/**
 * Movie details store state interface
 */
export interface MovieDetailsState {
  /**
   * Cached movie details by movie ID
   */
  cachedMovies: Record<number, MovieDetails>;
  /**
   * Loading state for fetching movie details
   */
  isFetchMovieDetailsLoading: boolean;
}

/**
 * Movie details store getters interface
 */
export interface MovieDetailsGetters {
  /**
   * Get cached movie by ID
   */
  getCachedMovie: (id: number) => MovieDetails | undefined;
  /**
   * Check if movie is cached
   */
  isMovieCached: (id: number) => boolean;
}

/**
 * Movie details store actions interface
 */
export interface MovieDetailsActions {
  /**
   * Fetch movie details by ID
   */
  fetchMovieDetails: (id: number) => Promise<void>;
  /**
   * Cache movie details
   */
  cacheMovie: (movie: MovieDetails) => void;
}

/**
 * Combined movie details store type
 */
export type MovieDetailsStore = MovieDetailsState &
  MovieDetailsGetters &
  MovieDetailsActions;

