<template>
  <div class="favorites">
    <MoviesGrid
      :is-loading="false"
      :display-movies="favoritesArray"
      :search="''"
      :selected-genres="[]"
      :can-load-more="false"
      :is-loading-more="false"
      :reset-filters="() => {}"
      :load-more="() => {}"
    />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { useFavoritesStore } from "@/stores/favorites";
import { MoviesGrid } from "@/components/movies-grid";

const favoritesStore = useFavoritesStore();
const { favoritesArray } = storeToRefs(favoritesStore);
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
