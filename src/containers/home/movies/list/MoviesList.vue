<template>
  <MoviesGrid
    :is-loading="isLoading"
    :display-movies="displayMovies"
    :search="search"
    :selected-genres="filterOptions.selectedGenres"
    :can-load-more="canLoadMore"
    :is-loading-more="isLoadingMore"
    :reset-filters="resetFilters"
    :load-more="loadMore"
  />
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useMoviesStore } from "@/stores/movies";
import { MoviesGrid } from "@/components/movies-grid";

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
</script>
