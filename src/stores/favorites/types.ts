import type { Movie } from "@/api/entities/movies/types";

/**
 * Favorites store state interface
 */
export interface FavoritesState {
  favorites: Record<number, Movie>;
}

/**
 * Favorites store getters interface
 */
export interface FavoritesGetters {
  favoriteIds: number[];
  isFavorite: (id: number) => boolean;
  getFavorite: (id: number) => Movie | undefined;
  favoritesList: Record<number, Movie>;
}

/**
 * Favorites store actions interface
 */
export interface FavoritesActions {
  addFavorite: (movie: Movie) => void;
  removeFavorite: (id: number) => void;
  toggleFavorite: (movie: Movie) => void;
  loadFavoritesFromStorage: () => void;
  clearFavorites: () => void;
}

/**
 * Favorites store type
 */
export type FavoritesStore = FavoritesState &
  FavoritesGetters &
  FavoritesActions;
