<template>
  <div class="home">
    <TopSection />
    <MoviesList />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount, ref } from "vue";
import { storeToRefs } from "pinia";
import debounce from "lodash.debounce";
import { TopSection } from "@/containers/home/movies/top-section";
import { MoviesList } from "@/containers/home/movies/list";
import { useMoviesStore } from "@/stores/movies";
import { getSearchFromUrl, getGenresFromUrl } from "@/stores/movies/utils";

const moviesStore = useMoviesStore();
const { movies, search, filterOptions, hasActiveFilters, searchedMovies } =
  storeToRefs(moviesStore);
const {
  fetchMovies,
  fetchSearchedMovies,
  resetSearchedMovies,
  fetchGenres,
  setSearch,
  setSelectedGenres,
} = moviesStore;

const isMounted = ref(false);
let stopSearchWatcher: (() => void) | null = null;
let stopGenresWatcher: (() => void) | null = null;

async function performSearch(): Promise<void> {
  // Don't perform search if component is unmounted
  if (!isMounted.value) {
    return;
  }

  // If both search and genres are empty, show popular movies
  if (!hasActiveFilters.value) {
    resetSearchedMovies();
    if (movies.value.length === 0 && isMounted.value) {
      await fetchMovies(1, false);
    }
    return;
  }

  // Reset and fetch with current search query and selected genres
  resetSearchedMovies();
  if (isMounted.value) {
    await fetchSearchedMovies(
      search.value.trim(),
      1,
      false,
      filterOptions.value.selectedGenres
    );
  }
}

// Create debounced search function using lodash.debounce
const debouncedSearch = debounce(() => {
  if (isMounted.value) {
    performSearch();
  }
}, 300);

/**
 * Sync query params from URL to store if they differ
 */
function syncQueryParamsToStore(): void {
  const urlSearch = getSearchFromUrl();
  const urlGenres = getGenresFromUrl();
  const storeSearch = search.value;
  const storeGenres = filterOptions.value.selectedGenres;

  // Sync search if URL has it and store doesn't match
  if (urlSearch !== storeSearch) {
    setSearch(urlSearch);
  }

  // Sync genres if URL has them and store doesn't match
  const genresMatch =
    urlGenres.length === storeGenres.length &&
    urlGenres.every((id, index) => id === storeGenres[index]);
  if (!genresMatch) {
    setSelectedGenres(urlGenres);
  }
}

// Initial load: fetch popular movies only if movies array is empty
onMounted(async () => {
  isMounted.value = true;

  // Sync query params from URL to store if they differ
  syncQueryParamsToStore();

  await fetchGenres();

  // If there are active filters (search or genres from URL), perform search
  // Otherwise, fetch popular movies if movies array is empty
  if (!searchedMovies.value.length && hasActiveFilters.value) {
    await performSearch();
  } else if (movies.value.length === 0) {
    await fetchMovies(1, false);
  }

  // Watch search value changes
  stopSearchWatcher = watch(
    search,
    () => {
      debouncedSearch();
    },
    { immediate: false }
  );

  // Watch selectedGenres changes
  stopGenresWatcher = watch(
    () => filterOptions.value.selectedGenres,
    async () => {
      await performSearch();
    },
    { deep: true }
  );
});

onBeforeUnmount(() => {
  isMounted.value = false;

  // Cancel any pending debounced calls
  debouncedSearch.cancel();

  if (stopSearchWatcher) {
    stopSearchWatcher();
    stopSearchWatcher = null;
  }

  if (stopGenresWatcher) {
    stopGenresWatcher();
    stopGenresWatcher = null;
  }
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
