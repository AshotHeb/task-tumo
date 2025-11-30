<template>
  <div class="movies-grid" ref="gridRef">
    <VirtualizationLoader v-if="isCalculationLoading" />
    <template v-else>
      <div v-if="isLoading" class="movies-grid__loading">
        <Loader size="lg" />
      </div>
      <div v-else-if="displayMovies.length === 0" class="movies-grid__empty">
        <div class="movies-grid__empty-content">
          <Text size="lg" weight="semibold" class="movies-grid__empty-title">
            No movies found
          </Text>
          <Text size="sm" class="movies-grid__empty-description">
            {{
              search.trim() || selectedGenres.length > 0
                ? `No results found${search.trim() ? ` for "${search}"` : ""}`
                : "Try adjusting your search or filters"
            }}
          </Text>
          <button
            v-if="search.trim() || selectedGenres.length > 0"
            type="button"
            class="movies-grid__reset-button"
            @click="resetFilters"
          >
            Clear filters
          </button>
        </div>
      </div>
      <template v-else>
        <ul class="movies-grid__grid">
          <MovieItem
            v-for="movie in displayMovies"
            :key="movie.id"
            :movie="movie"
          />
        </ul>
        <div
          ref="sentinelRef"
          class="movies-grid__sentinel"
          v-if="canLoadMore"
        ></div>
        <div v-if="isLoadingMore" class="movies-grid__loading-more">
          <Loader size="lg" />
        </div>
      </template>
    </template>
    <ScrollToTop :element-ref="gridRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { storeToRefs } from "pinia";
import type { MoviesGridProps } from "./types";
import { MovieItem } from "./movie-item";
import { VirtualizationLoader } from "./virtualization-loader";
import { useInfiniteScroll } from "@/shared/composables/use-infinite-scroll";
import { useWindowResize } from "@/shared/composables/use-window-resize";
import { Loader } from "@/shared/components/atoms/loader";
import { Text } from "@/shared/components/atoms/text";
import { ScrollToTop } from "@/components/scroll-to-top";
import { useMoviesGridVirtualizationStore } from "@/stores";

const props = defineProps<MoviesGridProps>();

const sentinelRef = ref<HTMLElement | null>(null);
const gridRef = ref<HTMLElement | null>(null);

const virtualizationStore = useMoviesGridVirtualizationStore();
const { isCalculationLoading } = storeToRefs(virtualizationStore);

const canLoadMoreRef = computed(() => props.canLoadMore);

useInfiniteScroll({
  elementRef: sentinelRef,
  handler: props.loadMore,
  enabled: canLoadMoreRef,
  threshold: 0.1,
});

// Handle window resize to recalculate grid dimensions
// Show loader immediately, calculation will be debounced in MockGrid
useWindowResize({
  handler: () => {
    // Set loading to true immediately to show loader
    virtualizationStore.setIsCalculationLoading(true);
  },
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
