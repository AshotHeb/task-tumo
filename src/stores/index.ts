export { useThemeStore } from "./theme";
export type { ThemeMode, ThemeStore } from "./theme";

export { useMoviesStore } from "./movies";
export { useMovieDetailsStore } from "./movie-details";
export type {
  MoviesStore,
  MoviesState,
  MoviesGetters,
  MoviesActions,
  MoviesFilterOptions,
} from "./movies";

export { useScrollPositionStore } from "./scroll-position";
export type {
  ScrollPositionStore,
  ScrollPositionState,
  ScrollPositionGetters,
  ScrollPositionActions,
} from "./scroll-position";

export { useFavoritesStore } from "./favorites";
export type {
  FavoritesStore,
  FavoritesState,
  FavoritesGetters,
  FavoritesActions,
} from "./favorites";
