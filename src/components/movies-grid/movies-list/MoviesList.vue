<template>
  <ul class="movies-list">
    <MovieItem v-for="movie in movies" :key="movie.id" :movie="movie" />
  </ul>
</template>

<script setup lang="ts">
import type { MoviesListProps } from "./types";
import { MovieItem } from "../movie-item";
import { computed } from "vue";

const props = defineProps<MoviesListProps>();
const movies = computed(() => props.movies);
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
