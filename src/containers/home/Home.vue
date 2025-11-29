<template>
  <div class="home">
    <TopSection />
    <MoviesList />
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch, onBeforeUnmount } from "vue";
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { TopSection } from "@/containers/home/movies/top-section";
import { MoviesList } from "@/containers/home/movies/list";
import { useMoviesStore } from "@/stores/movies";
import { useScrollPosition } from "@/shared/composables/use-scroll-position";

const route = useRoute();
const moviesStore = useMoviesStore();
const { movies, search } = storeToRefs(moviesStore);
const { fetchMovies, fetchSearchedMovies, resetSearchedMovies } = moviesStore;

// Save and restore scroll position
useScrollPosition({
  key: route.path,
});

let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;

function debounceSearch(value: string): void {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }

  searchDebounceTimer = setTimeout(async () => {
    if (value.trim()) {
      // Search has value: reset searchedMovies and fetch first page
      resetSearchedMovies();
      await fetchSearchedMovies(value.trim(), 1, false);
    }
    // If search is empty, do nothing (keep popular movies as they are)
  }, 300);
}

// Watch search value changes
watch(
  search,
  (newValue) => {
    debounceSearch(newValue);
  },
  { immediate: false }
);

// Initial load: fetch popular movies only if movies array is empty
onMounted(async () => {
  if (movies.value.length === 0) {
    await fetchMovies(1, false);
  }
});

onBeforeUnmount(() => {
  if (searchDebounceTimer) {
    clearTimeout(searchDebounceTimer);
  }
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
