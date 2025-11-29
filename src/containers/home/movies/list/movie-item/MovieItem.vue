<template>
  <li class="movie-item" @click="handleClick">
    <div class="movie-item__poster">
      <img
        v-if="movie.poster_path"
        :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
        :alt="movie.title"
        class="movie-item__image"
      />
      <div v-else class="movie-item__no-image">No Image</div>
    </div>
    <div class="movie-item__info">
      <Text as="h3" size="sm" weight="semibold" class="movie-item__title">
        {{ movie.title }}
      </Text>
      <Tooltip v-if="movie.overview" :content="movie.overview" position="top">
        <Text size="xs" class="movie-item__overview">
          {{ movie.overview }}
        </Text>
      </Tooltip>
      <div class="movie-item__meta">
        <Text size="xs" weight="medium" class="movie-item__rating">
          <span class="movie-item__star">★</span>
          {{ movie.vote_average.toFixed(1) }}
        </Text>
        <Text size="xs" class="movie-item__date">
          {{ formatDate(movie.release_date) }}
        </Text>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import type { MovieItemProps } from "./types";
import { Text } from "@/shared/components/atoms/text";
import { Tooltip } from "@/shared/components/atoms/tooltip";

const props = defineProps<MovieItemProps>();
const router = useRouter();

function formatDate(dateString: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.getFullYear().toString();
}

function handleClick(): void {
  router.push(`/movie/${props.movie.id}`);
}
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
