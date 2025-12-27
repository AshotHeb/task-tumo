<template>
  <div class="movies-grid" ref="gridRef">
    <VirtualizationLoader v-if="isCalculationLoading" />
    <template v-else>
      <div v-if="isLoading && !isLoadingMore" class="movies-grid__loading">
        <Loader size="lg" />
      </div>
      <div
        v-else-if="visibleItemsData.data.length === 0"
        class="movies-grid__empty"
      >
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
        <ul class="movies-grid__grid" ref="gridListRef">
          <template
            v-for="(movie, index) in visibleItemsData.data"
            :key="`${movie.id}-${index}`"
          >
            <MovieItem
              :movie="movie"
              :is-absolute="!isCalculationLoading"
              :style="
                !isCalculationLoading && columnWidth > 0
                  ? {
                      top: `${getTopPositionOfMovies(
                        visibleItemsData.startIndex + index
                      )}px`,
                      left: `${getLeftPositionOfMovies(
                        visibleItemsData.startIndex + index
                      )}px`,
                      width: `${columnWidth}px`,
                    }
                  : undefined
              "
            />
          </template>
          <div
            v-if="
              canLoadMore &&
              isInitialLoadComplete &&
              !isCalculationLoading &&
              visibleItemsData.data.length > 0
            "
            ref="sentinelRef"
            class="movies-grid__sentinel"
            :style="
              !isCalculationLoading && columnWidth > 0 && gridRowHeight > 0
                ? {
                    top: `${
                      getTopPositionOfMovies(displayMovies.length - 1) +
                      gridRowHeight +
                      gridVerticalGap -
                      500 // threshold for infinite scroll
                    }px`,
                    left: `${getLeftPositionOfMovies(0)}px`,
                    width: `${columnWidth}px`,
                  }
                : undefined
            "
          ></div>
        </ul>
        <div v-if="isLoadingMore" class="movies-grid__loading-more">
          <Loader size="lg" />
        </div>
      </template>
    </template>
    <ScrollToTopButton :containerRef="gridRef" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { storeToRefs } from "pinia";
import type { MoviesGridProps } from "./types";
import { MovieItem } from "./movie-item";
import { VirtualizationLoader } from "./virtualization-loader";
import { useInfiniteScroll } from "@/shared/composables/use-infinite-scroll";
import { useWindowResize } from "@/shared/composables/use-window-resize";
import { useVirtualizedRendering } from "@/shared/composables/use-virtualized-rendering";
import { Loader } from "@/shared/components/atoms/loader";
import { Text } from "@/shared/components/atoms/text";
import { ScrollToTopButton } from "@/components/scroll-to-top-button";
import { useMoviesGridVirtualizationStore } from "@/stores";
import { getContainerHeight } from "@/utils/virtualization";
import { useScrollPosition } from "@/shared/composables/use-scroll-position";
import { useRoute } from "vue-router";

const props = defineProps<MoviesGridProps>();

const sentinelRef = ref<HTMLElement | null>(null);
const gridRef = ref<HTMLElement | null>(null);
const gridListRef = ref<HTMLElement | null>(null);
const isInitialLoadComplete = ref(false);

const virtualizationStore = useMoviesGridVirtualizationStore();
const {
  isCalculationLoading,
  gridRowHeight,
  columnsCount,
  gridVerticalGap,
  columnWidth,
} = storeToRefs(virtualizationStore);

const { getTopPositionOfMovies, getLeftPositionOfMovies } = virtualizationStore;

const route = useRoute();
const canLoadMoreRef = computed(() => props.canLoadMore);

// Get container ref - use prop if provided, otherwise use gridRef
const containerRef = computed(() => props.containerRef?.value || gridRef.value);

// Track movies list length for height recalculation
const moviesLength = computed(() => props.displayMovies.length);

// Use virtualized rendering composable to track visible rows
const { visibleRange } = useVirtualizedRendering({
  containerElement: containerRef,
  rowHeight: gridRowHeight,
  rowGap: gridVerticalGap,
});

const visibleItemsData = computed(() => {
  const visibleFirRowIndex =
    visibleRange.value.start > 0 ? visibleRange.value.start : 0;
  const visibleLastRowIndex = visibleRange.value.end;

  const sliceStartIndex = visibleFirRowIndex * columnsCount.value;
  const sliceEndIndex = visibleLastRowIndex * columnsCount.value;

  console.log("Computed");

  return {
    data: props.displayMovies.slice(sliceStartIndex, sliceEndIndex),
    startIndex: sliceStartIndex,
  };
});

useScrollPosition({
  key: route.path,
  elementRef: gridRef,
  waitForCondition: computed(() => !isHeightCalculated.value),
});

// Calculate number of rows based on total movies and items per row
const numberOfRows = computed(() => {
  if (columnsCount.value === 0) return 0;
  return Math.ceil(moviesLength.value / columnsCount.value);
});

// Track if height has been calculated and set
const isHeightCalculated = ref(false);

// Function to calculate and set container height
function calculateAndSetHeight(): void {
  // Check if metrics exist and calculation is not loading
  const hasMetrics =
    gridRowHeight.value > 0 &&
    columnsCount.value > 0 &&
    gridVerticalGap.value >= 0 &&
    numberOfRows.value > 0;

  if (!isCalculationLoading.value && hasMetrics && gridListRef.value) {
    const height = getContainerHeight(
      gridRowHeight.value,
      numberOfRows.value,
      gridVerticalGap.value
    );
    gridListRef.value.style.height = `${height}px`;
    isHeightCalculated.value = true;
  } else {
    isHeightCalculated.value = false;
  }
}

// Calculate and set container height when metrics are ready or movies list changes
watch(
  [
    isCalculationLoading,
    gridRowHeight,
    columnsCount,
    gridVerticalGap,
    gridListRef,
    numberOfRows,
  ],
  () => {
    calculateAndSetHeight();
  },
  { immediate: true }
);

// Prevent infinite scroll from triggering on initial page load
const shouldEnableInfiniteScroll = computed(() => {
  return (
    canLoadMoreRef.value && isInitialLoadComplete.value && !props.isLoading
  );
});

useInfiniteScroll({
  elementRef: sentinelRef,
  handler: props.loadMore,
  enabled: shouldEnableInfiniteScroll,
});

// Scroll to top when filters change (search or genres)
watch(
  [() => props.search, () => props.selectedGenres],
  () => {
    if (gridRef.value) {
      gridRef.value.scrollTo({
        top: 0,
        behavior: "instant",
      });
    }
  },
  { deep: true }
);

// Mark initial load as complete after first render and when not loading
watch(
  [() => props.isLoading, () => props.displayMovies.length],
  ([isLoading, moviesLength]) => {
    if (
      isLoading === false &&
      typeof moviesLength === "number" &&
      moviesLength > 0 &&
      !isInitialLoadComplete.value
    ) {
      isInitialLoadComplete.value = true;
    }
  },
  { immediate: true }
);

// Handle window resize to recalculate grid dimensions and height
// Show loader immediately, calculation will be debounced in MockGrid
useWindowResize({
  handler: () => {
    // Set loading to true immediately to show loader
    virtualizationStore.setIsCalculationLoading(true);
    // Recalculate height when resize happens (metrics will be updated after calculation)
    // The watch will handle the recalculation when metrics are ready
    calculateAndSetHeight();
  },
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
