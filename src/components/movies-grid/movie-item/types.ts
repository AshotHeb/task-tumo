import type { Movie } from "@/api/entities/movies/types";

/**
 * Movie item component props interface
 */
export interface MovieItemProps {
  /**
   * Movie data to display
   */
  movie: Movie;
  /**
   * Whether to use absolute positioning
   * @default false
   */
  isAbsolute?: boolean;
}
