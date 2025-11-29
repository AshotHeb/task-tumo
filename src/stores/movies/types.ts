import type { Movie } from "@/api/entities/movies/types";

/**
 * Movies filter options
 */
export interface MoviesFilterOptions {
  search: string;
}

/**
 * Movies store state interface
 */
export interface MoviesState {
  filterOptions: MoviesFilterOptions;
  movies: Movie[];
  searchedMovies: Movie[];
  isFetchMoviesLoading: boolean;
  isFetchSearchedMoviesLoading: boolean;
  currentPage: number;
  searchedCurrentPage: number;
  totalPages: number;
  searchedTotalPages: number;
}

/**
 * Movies store getters interface
 */
export interface MoviesGetters {
  search: string;
}

/**
 * Movies store actions interface
 */
export interface MoviesActions {
  setSearch: (search: string) => void;
  fetchMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchSearchedMovies: (
    query: string,
    page?: number,
    append?: boolean
  ) => Promise<void>;
  resetMovies: () => void;
  resetSearchedMovies: () => void;
}

/**
 * Movies store type
 */
export type MoviesStore = MoviesState & MoviesGetters & MoviesActions;
