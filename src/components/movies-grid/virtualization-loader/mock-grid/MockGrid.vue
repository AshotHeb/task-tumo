<template>
  <div class="mock-grid-list" ref="containerRef">
    <MovieItem v-for="movie in movies" :key="movie.id" :movie="movie" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from "vue";
import debounce from "lodash.debounce";
import { useMoviesGridVirtualizationStore } from "@/stores/movies-grid-virtualization";
import { MOCK_MOVIES } from "./consts";
import MovieItem from "../../movie-item/MovieItem.vue";

const containerRef = ref<HTMLDivElement | null>(null);
const virtualizationStore = useMoviesGridVirtualizationStore();

// Use hardcoded mock movies from consts
const movies = MOCK_MOVIES;

function calculateRowInfo(): void {
  if (!containerRef.value) {
    return;
  }

  // Use containerRef directly as it's the list element
  const listElement = containerRef.value;

  const items = listElement.querySelectorAll(".movie-item");
  if (items.length === 0) {
    return;
  }

  // Get container width
  const containerRect = listElement.getBoundingClientRect();
  const containerWidth = containerRect.width;

  // Get first item width
  const firstItem = items[0] as HTMLElement;
  const firstItemRect = firstItem.getBoundingClientRect();
  const itemWidth = firstItemRect.width;

  // Get grid gaps from CSS
  const computedStyle = window.getComputedStyle(listElement);
  const gapValue =
    computedStyle.gap || computedStyle.rowGap || computedStyle.columnGap;

  // Parse gap value to pixels
  let horizontalGap = 0;
  if (gapValue) {
    const gapParts = gapValue.trim().split(/\s+/);
    // If gap has two values, second is column gap, otherwise use the same value
    const columnGapValue = gapParts.length > 1 ? gapParts[1] : gapParts[0];
    const numericValue = parseFloat(columnGapValue);
    if (!isNaN(numericValue)) {
      horizontalGap = numericValue;
    }
  }

  // Calculate items per row: (containerWidth + gap) / (itemWidth + gap)
  const itemsPerRow = Math.floor(
    (containerWidth + horizontalGap) / (itemWidth + horizontalGap)
  );

  // Get row height from first item
  const rowHeight = firstItem.offsetHeight;

  // Get vertical gap from CSS
  let verticalGap = 0;
  if (gapValue) {
    const gapParts = gapValue.trim().split(/\s+/);
    // First value is row gap (vertical)
    const rowGapValue = gapParts[0];
    const numericValue = parseFloat(rowGapValue);
    if (!isNaN(numericValue)) {
      verticalGap = numericValue;
    }
  }

  // Update store with calculated values
  virtualizationStore.setGridRowHeight(Math.round(rowHeight));
  virtualizationStore.setRowGridItemsCount(itemsPerRow);
  virtualizationStore.setGridVerticalGap(Math.round(verticalGap));
  virtualizationStore.setGridHorizontalGap(Math.round(horizontalGap));
  virtualizationStore.setColumnWidth(Math.round(itemWidth));
  virtualizationStore.setIsCalculationLoading(false);
}

// Create debounced calculation function
const debouncedCalculateRowInfo = debounce(() => {
  // Wait for next tick to ensure DOM is fully rendered
  nextTick().then(() => {
    // Add a small delay to ensure all styles are applied
    setTimeout(() => {
      calculateRowInfo();
    }, 100);
  });
}, 250);

onMounted(async () => {
  // Wait for next tick to ensure DOM is fully rendered
  await nextTick();

  // Use debounced calculation
  debouncedCalculateRowInfo();
});

// Cleanup: cancel any pending debounced calls on unmount
onBeforeUnmount(() => {
  debouncedCalculateRowInfo.cancel();
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
