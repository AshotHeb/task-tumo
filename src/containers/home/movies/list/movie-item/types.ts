import type { Movie } from "@/api/entities/movies/types";

/**
 * Movie item component props interface
 */
export interface MovieItemProps {
  /**
   * Movie data to display
   */
  movie: Movie;
}

