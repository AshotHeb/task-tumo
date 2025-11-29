<template>
  <section class="top-section">
    <Input
      v-model="searchValue"
      type="search"
      placeholder="Search movies..."
      class="top-section__input"
    />
    <Select
      v-model="selectedFilters"
      :options="genreOptions"
      placeholder="Filter by..."
      class="top-section__select"
    />
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { Input } from "@/shared/components/atoms/input";
import { Select } from "@/shared/components/molecules/select";
import type { SelectOption } from "@/shared/components/molecules/select";
import { useMoviesStore } from "@/stores/movies";

const moviesStore = useMoviesStore();
const { search, genres } = storeToRefs(moviesStore);
const { setSearch } = moviesStore;

const searchValue = computed({
  get: () => search.value,
  set: (value: string) => {
    setSearch(value);
  },
});

// Map genres from store to SelectOption format
const genreOptions = computed<SelectOption[]>(() => {
  return genres.value.map((genre) => ({
    value: String(genre.id),
    label: genre.name,
  }));
});

const selectedFilters = ref<string[]>([]);
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
