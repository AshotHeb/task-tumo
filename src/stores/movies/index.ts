import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { MoviesState, MoviesGetters } from "./types";
import { getSearchFromUrl, updateSearchInUrl } from "./utils";
import {
  getPopularMovies,
  searchMovies,
  getGenreList,
} from "@/api/entities/movies";

export const useMoviesStore = defineStore("movies", () => {
  // State
  const filterOptions = ref<MoviesState["filterOptions"]>({
    search: getSearchFromUrl(),
    selectedGenres: [],
  });
  const movies = ref<MoviesState["movies"]>([]);
  const searchedMovies = ref<MoviesState["searchedMovies"]>([]);
  const genres = ref<MoviesState["genres"]>([]);
  const isFetchMoviesLoading = ref<MoviesState["isFetchMoviesLoading"]>(false);
  const isFetchSearchedMoviesLoading =
    ref<MoviesState["isFetchSearchedMoviesLoading"]>(false);
  const isUserTypinginSearchInput =
    ref<MoviesState["isUserTypinginSearchInput"]>(false);
  const currentPage = ref<MoviesState["currentPage"]>(0);
  const searchedCurrentPage = ref<MoviesState["searchedCurrentPage"]>(0);
  const totalPages = ref<MoviesState["totalPages"]>(0);
  const searchedTotalPages = ref<MoviesState["searchedTotalPages"]>(0);

  // Getters
  const search = computed<MoviesGetters["search"]>(
    () => filterOptions.value.search
  );

  const isLoading = computed<MoviesGetters["isLoading"]>(
    () =>
      isFetchMoviesLoading.value ||
      isFetchSearchedMoviesLoading.value ||
      isUserTypinginSearchInput.value
  );

  const hasActiveFilters = computed(() => {
    const hasSearch = search.value.trim().length > 0;
    const hasGenres = filterOptions.value.selectedGenres.length > 0;
    return hasSearch || hasGenres;
  });

  const displayMovies = computed<MoviesGetters["displayMovies"]>(() => {
    // Show searched movies if there's a search query or selected genres, otherwise show popular movies
    return hasActiveFilters.value ? searchedMovies.value : movies.value;
  });

  const isLoadingMore = computed<MoviesGetters["isLoadingMore"]>(() => {
    return displayMovies.value.length > 0 && isLoading.value;
  });

  const canLoadMore = computed<MoviesGetters["canLoadMore"]>(() => {
    if (hasActiveFilters.value) {
      return (
        searchedCurrentPage.value < searchedTotalPages.value &&
        !isFetchSearchedMoviesLoading.value
      );
    }
    return currentPage.value < totalPages.value && !isFetchMoviesLoading.value;
  });

  // Actions
  function setSearch(searchValue: string): void {
    filterOptions.value.search = searchValue;
    updateSearchInUrl(searchValue);
    // Set typing state to true if user is typing (search value is not empty)
    if (searchValue.trim().length > 0) {
      isUserTypinginSearchInput.value = true;
    }
  }

  function setSelectedGenres(genreIds: number[]): void {
    filterOptions.value.selectedGenres = genreIds;
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
    append: boolean = false,
    genreIds?: number[]
  ): Promise<void> {
    if (isFetchSearchedMoviesLoading.value) {
      return;
    }

    // Use provided genreIds or fall back to selectedGenres from filterOptions
    const genresToUse = genreIds ?? filterOptions.value.selectedGenres;
    const hasQuery = query.trim().length > 0;
    const hasGenres = genresToUse.length > 0;

    // If both query and genres are empty, clear searched movies
    if (!hasQuery && !hasGenres) {
      searchedMovies.value = [];
      searchedCurrentPage.value = 0;
      searchedTotalPages.value = 0;
      isUserTypinginSearchInput.value = false;
      return;
    }

    try {
      isFetchSearchedMoviesLoading.value = true;

      const response = await searchMovies({
        with_text_query: hasQuery ? query.trim() : undefined,
        with_genres: hasGenres ? genresToUse : undefined,
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
      // Set typing state to false when request completes
      isUserTypinginSearchInput.value = false;
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

  async function fetchGenres(): Promise<void> {
    // Only fetch if genres list is empty
    if (genres.value.length > 0) {
      return;
    }

    try {
      const response = await getGenreList({ language: "en-US" });
      genres.value = response.data.genres;
    } catch (error) {
      console.error("Failed to fetch genres:", error);
      throw error;
    }
  }

  async function loadMore(): Promise<void> {
    if (!canLoadMore.value || isLoading.value) {
      return;
    }

    if (hasActiveFilters.value) {
      const nextPage = searchedCurrentPage.value + 1;
      await fetchSearchedMovies(
        search.value.trim(),
        nextPage,
        true,
        filterOptions.value.selectedGenres
      );
    } else {
      const nextPage = currentPage.value + 1;
      await fetchMovies(nextPage, true);
    }
  }

  function resetFilters(): void {
    setSearch("");
    setSelectedGenres([]);
    isUserTypinginSearchInput.value = false;
  }

  return {
    // State
    filterOptions,
    movies,
    searchedMovies,
    genres,
    isFetchMoviesLoading,
    isFetchSearchedMoviesLoading,
    isUserTypinginSearchInput,
    currentPage,
    searchedCurrentPage,
    totalPages,
    searchedTotalPages,
    // Getters
    search,
    hasActiveFilters,
    isLoading,
    isLoadingMore,
    displayMovies,
    canLoadMore,
    // Actions
    setSearch,
    setSelectedGenres,
    fetchMovies,
    fetchSearchedMovies,
    fetchGenres,
    loadMore,
    resetMovies,
    resetSearchedMovies,
    resetFilters,
  };
});

export type {
  MoviesStore,
  MoviesState,
  MoviesGetters,
  MoviesActions,
  MoviesFilterOptions,
} from "./types";
