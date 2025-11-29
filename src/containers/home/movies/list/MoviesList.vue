<template>
  <div class="movies-list">
    <div
      v-if="isLoading && displayMovies.length === 0"
      class="movies-list__loading"
    >
      <Loader size="lg" />
    </div>
    <div v-else-if="displayMovies.length === 0" class="movies-list__empty">
      <div class="movies-list__empty-content">
        <Text size="lg" weight="semibold" class="movies-list__empty-title">
          No movies found
        </Text>
        <Text size="sm" class="movies-list__empty-description">
          {{
            search.trim()
              ? `No results found for "${search}"`
              : "Try adjusting your search or filters"
          }}
        </Text>
        <button
          v-if="search.trim()"
          type="button"
          class="movies-list__reset-button"
          @click="handleResetFilters"
        >
          Clear search
        </button>
      </div>
    </div>
    <template v-else>
      <ul class="movies-list__grid">
        <MovieItem
          v-for="movie in displayMovies"
          :key="movie.id"
          :movie="movie"
        />
      </ul>
      <div
        ref="sentinelRef"
        class="movies-list__sentinel"
        v-if="canLoadMore"
      ></div>
      <div v-if="isLoadingMore" class="movies-list__loading-more">
        <Loader size="lg" />
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useMoviesStore } from "@/stores/movies";
import { MovieItem } from "./movie-item";
import { useInfiniteScroll } from "@/shared/composables/use-infinite-scroll";
import { Loader } from "@/shared/components/atoms/loader";
import { Text } from "@/shared/components/atoms/text";

const moviesStore = useMoviesStore();
const {
  movies,
  searchedMovies,
  search,
  isFetchMoviesLoading,
  isFetchSearchedMoviesLoading,
  currentPage,
  searchedCurrentPage,
  totalPages,
  searchedTotalPages,
} = storeToRefs(moviesStore);

const { fetchMovies, fetchSearchedMovies, setSearch } = moviesStore;

const sentinelRef = ref<HTMLElement | null>(null);

const isLoading = computed(
  () => isFetchMoviesLoading.value || isFetchSearchedMoviesLoading.value
);

const isLoadingMore = computed(() => {
  return displayMovies.value.length > 0 && isLoading.value;
});

const displayMovies = computed(() => {
  // Show searched movies if there's a search query, otherwise show popular movies
  return search.value.trim() ? searchedMovies.value : movies.value;
});

const canLoadMore = computed(() => {
  const hasSearch = search.value.trim();
  if (hasSearch) {
    return (
      searchedCurrentPage.value < searchedTotalPages.value &&
      !isFetchSearchedMoviesLoading.value
    );
  }
  return currentPage.value < totalPages.value && !isFetchMoviesLoading.value;
});

const loadMore = async (): Promise<void> => {
  if (!canLoadMore.value || isLoading.value) {
    return;
  }

  const hasSearch = search.value.trim();
  if (hasSearch) {
    const nextPage = searchedCurrentPage.value + 1;
    await fetchSearchedMovies(search.value, nextPage, true);
  } else {
    const nextPage = currentPage.value + 1;
    await fetchMovies(nextPage, true);
  }
};

const handleResetFilters = (): void => {
  setSearch("");
};

useInfiniteScroll({
  elementRef: sentinelRef,
  handler: loadMore,
  enabled: canLoadMore,
  threshold: 0.1,
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
