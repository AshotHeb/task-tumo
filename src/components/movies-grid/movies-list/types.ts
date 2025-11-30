import type { Movie } from "@/api/entities/movies/types";

/**
 * Movies list component props interface
 */
export interface MoviesListProps {
  /**
   * Array of movies to display
   */
  movies: Movie[];
}

