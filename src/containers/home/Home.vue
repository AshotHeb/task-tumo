<template>
  <div class="home">
    <TopSection />
    <MoviesList />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { TopSection } from "@/containers/home/movies/top-section";
import { MoviesList } from "@/containers/home/movies/list";
import { useMoviesStore } from "@/stores/movies";

const moviesStore = useMoviesStore();

onMounted(async () => {
  await moviesStore.fetchMovies(1, false);
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
