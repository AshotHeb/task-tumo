<template>
  <section class="top-section">
    <Input
      v-model="searchValue"
      type="search"
      placeholder="Search movies..."
      class="top-section__input"
    />
  </section>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { Input } from "@/shared/components/atoms/input";
import { useMoviesStore } from "@/stores/movies";

const moviesStore = useMoviesStore();
const { search } = storeToRefs(moviesStore);
const { setSearch } = moviesStore;

const searchValue = computed({
  get: () => search.value,
  set: (value: string) => {
    setSearch(value);
  },
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
