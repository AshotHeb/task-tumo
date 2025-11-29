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
            search.trim() || filterOptions.selectedGenres.length > 0
              ? `No results found${search.trim() ? ` for "${search}"` : ""}`
              : "Try adjusting your search or filters"
          }}
        </Text>
        <button
          v-if="search.trim() || filterOptions.selectedGenres.length > 0"
          type="button"
          class="movies-list__reset-button"
          @click="resetFilters"
        >
          Clear filters
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
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { useMoviesStore } from "@/stores/movies";
import { MovieItem } from "./movie-item";
import { useInfiniteScroll } from "@/shared/composables/use-infinite-scroll";
import { Loader } from "@/shared/components/atoms/loader";
import { Text } from "@/shared/components/atoms/text";

const moviesStore = useMoviesStore();
const {
  search,
  filterOptions,
  isLoading,
  isLoadingMore,
  displayMovies,
  canLoadMore,
} = storeToRefs(moviesStore);

const { loadMore, resetFilters } = moviesStore;

const sentinelRef = ref<HTMLElement | null>(null);

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
