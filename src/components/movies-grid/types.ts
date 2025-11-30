import type { Ref } from "vue";
import type { Movie } from "@/api/entities/movies/types";

/**
 * Movies grid component props interface
 */
export interface MoviesGridProps {
  /**
   * Whether movies are loading
   */
  isLoading: boolean;
  /**
   * Array of movies to display
   */
  displayMovies: Movie[];
  /**
   * Search query string
   */
  search: string;
  /**
   * Selected genre IDs
   */
  selectedGenres: number[];
  /**
   * Whether more movies can be loaded
   */
  canLoadMore: boolean;
  /**
   * Whether more movies are currently loading
   */
  isLoadingMore: boolean;
  /**
   * Function to reset filters
   */
  resetFilters: () => void;
  /**
   * Function to load more movies
   */
  loadMore: () => void;
  /**
   * Container element reference for height calculation
   */
  containerRef?: Ref<HTMLElement | null>;
}
