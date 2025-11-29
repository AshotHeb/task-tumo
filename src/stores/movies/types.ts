import type { Movie, Genre } from "@/api/entities/movies/types";

/**
 * Movies filter options
 */
export interface MoviesFilterOptions {
  search: string;
  selectedGenres: number[];
}

/**
 * Movies store state interface
 */
export interface MoviesState {
  filterOptions: MoviesFilterOptions;
  movies: Movie[];
  searchedMovies: Movie[];
  genres: Genre[];
  isFetchMoviesLoading: boolean;
  isFetchSearchedMoviesLoading: boolean;
  isUserTypinginSearchInput: boolean;
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
  hasActiveFilters: boolean;
  isLoading: boolean;
  isLoadingMore: boolean;
  displayMovies: Movie[];
  canLoadMore: boolean;
}

/**
 * Movies store actions interface
 */
export interface MoviesActions {
  setSearch: (search: string) => void;
  setSelectedGenres: (genreIds: number[]) => void;
  fetchMovies: (page?: number, append?: boolean) => Promise<void>;
  fetchSearchedMovies: (
    query: string,
    page?: number,
    append?: boolean,
    genreIds?: number[]
  ) => Promise<void>;
  fetchGenres: () => Promise<void>;
  loadMore: () => Promise<void>;
  resetMovies: () => void;
  resetSearchedMovies: () => void;
  resetFilters: () => void;
}

/**
 * Movies store type
 */
export type MoviesStore = MoviesState & MoviesGetters & MoviesActions;
