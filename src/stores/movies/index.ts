import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { MoviesState, MoviesGetters } from "./types";
import { getSearchFromUrl, updateSearchInUrl } from "./utils";
import { getPopularMovies, searchMovies } from "@/api/entities/movies";

export const useMoviesStore = defineStore("movies", () => {
  // State
  const filterOptions = ref<MoviesState["filterOptions"]>({
    search: getSearchFromUrl(),
  });
  const movies = ref<MoviesState["movies"]>([]);
  const searchedMovies = ref<MoviesState["searchedMovies"]>([]);
  const isFetchMoviesLoading = ref<MoviesState["isFetchMoviesLoading"]>(false);
  const isFetchSearchedMoviesLoading =
    ref<MoviesState["isFetchSearchedMoviesLoading"]>(false);
  const currentPage = ref<MoviesState["currentPage"]>(0);
  const searchedCurrentPage = ref<MoviesState["searchedCurrentPage"]>(0);
  const totalPages = ref<MoviesState["totalPages"]>(0);
  const searchedTotalPages = ref<MoviesState["searchedTotalPages"]>(0);

  // Getters
  const search = computed<MoviesGetters["search"]>(
    () => filterOptions.value.search
  );

  // Actions
  function setSearch(searchValue: string): void {
    filterOptions.value.search = searchValue;
    updateSearchInUrl(searchValue);
  }

  async function fetchMovies(
    page: number = 1,
    append: boolean = false
  ): Promise<void> {
    if (isFetchMoviesLoading.value) {
      return;
    }

    try {
      isFetchMoviesLoading.value = true;

      const response = await getPopularMovies({ page, language: "en-US" });
      const { results, page: responsePage, total_pages } = response.data;

      if (append) {
        // Append to existing movies for infinite loading
        movies.value = [...movies.value, ...results];
      } else {
        // Replace movies for new fetch
        movies.value = results;
      }

      currentPage.value = responsePage;
      totalPages.value = total_pages;
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      throw error;
    } finally {
      isFetchMoviesLoading.value = false;
    }
  }

  async function fetchSearchedMovies(
    query: string,
    page: number = 1,
    append: boolean = false
  ): Promise<void> {
    if (isFetchSearchedMoviesLoading.value) {
      return;
    }

    if (!query.trim()) {
      searchedMovies.value = [];
      searchedCurrentPage.value = 0;
      searchedTotalPages.value = 0;
      return;
    }

    try {
      isFetchSearchedMoviesLoading.value = true;

      const response = await searchMovies({
        query: query.trim(),
        page,
        language: "en-US",
      });
      const { results, page: responsePage, total_pages } = response.data;

      if (append) {
        // Append to existing searched movies for infinite loading
        searchedMovies.value = [...searchedMovies.value, ...results];
      } else {
        // Replace searched movies for new search
        searchedMovies.value = results;
      }

      searchedCurrentPage.value = responsePage;
      searchedTotalPages.value = total_pages;
    } catch (error) {
      console.error("Failed to fetch searched movies:", error);
      throw error;
    } finally {
      isFetchSearchedMoviesLoading.value = false;
    }
  }

  function resetMovies(): void {
    movies.value = [];
    currentPage.value = 0;
    totalPages.value = 0;
  }

  function resetSearchedMovies(): void {
    searchedMovies.value = [];
    searchedCurrentPage.value = 0;
    searchedTotalPages.value = 0;
  }

  return {
    // State
    filterOptions,
    movies,
    searchedMovies,
    isFetchMoviesLoading,
    isFetchSearchedMoviesLoading,
    currentPage,
    searchedCurrentPage,
    totalPages,
    searchedTotalPages,
    // Getters
    search,
    // Actions
    setSearch,
    fetchMovies,
    fetchSearchedMovies,
    resetMovies,
    resetSearchedMovies,
  };
});

export type {
  MoviesStore,
  MoviesState,
  MoviesGetters,
  MoviesActions,
  MoviesFilterOptions,
} from "./types";
