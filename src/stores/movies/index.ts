import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { MoviesState, MoviesGetters } from "./types";
import { getSearchFromUrl, updateSearchInUrl } from "./utils";

export const useMoviesStore = defineStore("movies", () => {
  // State
  const filterOptions = ref<MoviesState["filterOptions"]>({
    search: getSearchFromUrl(),
  });
  const isFetchMoviesLoading = ref<MoviesState["isFetchMoviesLoading"]>(false);

  // Getters
  const search = computed<MoviesGetters["search"]>(
    () => filterOptions.value.search
  );

  // Actions
  function setSearch(searchValue: string): void {
    filterOptions.value.search = searchValue;
    updateSearchInUrl(searchValue);
  }

  function setIsFetchMoviesLoading(loading: boolean): void {
    isFetchMoviesLoading.value = loading;
  }

  return {
    // State
    filterOptions,
    isFetchMoviesLoading,
    // Getters
    search,
    // Actions
    setSearch,
    setIsFetchMoviesLoading,
  };
});

export type {
  MoviesStore,
  MoviesState,
  MoviesGetters,
  MoviesActions,
  MoviesFilterOptions,
} from "./types";
