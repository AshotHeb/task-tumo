<template>
  <div class="movies-list">
    <div v-if="isLoading" class="movies-list__loading">Loading movies...</div>
    <div v-else-if="displayMovies.length === 0" class="movies-list__empty">
      No movies found
    </div>
    <ul v-else class="movies-list__grid">
      <MovieItem
        v-for="movie in displayMovies"
        :key="movie.id"
        :movie="movie"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useMoviesStore } from "@/stores/movies";
import { MovieItem } from "./movie-item";

const moviesStore = useMoviesStore();
const { movies, searchedMovies, search, isFetchMoviesLoading } =
  storeToRefs(moviesStore);

const isLoading = computed(() => isFetchMoviesLoading.value);

const displayMovies = computed(() => {
  // Show searched movies if there's a search query, otherwise show popular movies
  return search.value.trim() ? searchedMovies.value : movies.value;
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
