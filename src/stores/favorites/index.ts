import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { FavoritesState, FavoritesGetters } from "./types";
import type { Movie } from "@/api/entities/movies/types";
import {
  saveFavoritesToStorage,
  loadFavoritesFromStorage,
} from "./utils";

export const useFavoritesStore = defineStore("favorites", () => {
  // State
  const favorites = ref<FavoritesState["favorites"]>(
    loadFavoritesFromStorage()
  );

  // Getters
  const favoriteIds = computed<FavoritesGetters["favoriteIds"]>(() => {
    return Object.keys(favorites.value).map(Number);
  });

  const isFavorite = computed<FavoritesGetters["isFavorite"]>(
    () => (id: number) => {
      return id in favorites.value;
    }
  );

  const getFavorite = computed<FavoritesGetters["getFavorite"]>(
    () => (id: number) => {
      return favorites.value[id];
    }
  );

  const favoritesList = computed<FavoritesGetters["favoritesList"]>(() => {
    return favorites.value;
  });

  // Actions
  function addFavorite(movie: Movie): void {
    favorites.value[movie.id] = movie;
    saveFavoritesToStorage(favorites.value);
  }

  function removeFavorite(id: number): void {
    delete favorites.value[id];
    saveFavoritesToStorage(favorites.value);
  }

  function toggleFavorite(movie: Movie): void {
    if (isFavorite.value(movie.id)) {
      removeFavorite(movie.id);
    } else {
      addFavorite(movie);
    }
  }

  function loadFavoritesFromStorageAction(): void {
    favorites.value = loadFavoritesFromStorage();
  }

  function clearFavorites(): void {
    favorites.value = {};
    saveFavoritesToStorage({});
  }

  return {
    // State
    favorites,
    // Getters
    favoriteIds,
    isFavorite,
    getFavorite,
    favoritesList,
    // Actions
    addFavorite,
    removeFavorite,
    toggleFavorite,
    loadFavoritesFromStorage: loadFavoritesFromStorageAction,
    clearFavorites,
  };
});

export type {
  FavoritesStore,
  FavoritesState,
  FavoritesGetters,
  FavoritesActions,
} from "./types";

