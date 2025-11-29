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
  isFetchMoviesLoading: boolean;
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
  setIsFetchMoviesLoading: (loading: boolean) => void;
}

/**
 * Movies store type
 */
export type MoviesStore = MoviesState & MoviesGetters & MoviesActions;

