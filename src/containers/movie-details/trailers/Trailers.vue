<template>
  <div class="trailers">
    <div v-if="trailers && trailers.length > 0" class="trailers__content">
      <Text size="lg" weight="semibold" class="trailers__title">
        Trailers ({{ trailers.length }})
      </Text>
      <Carousel
        :items="trailers"
        :show-arrows="true"
        :show-indicators="true"
        :swipeable="true"
        class="trailers__carousel"
      >
        <template #default="{ item }">
          <div class="trailers__item">
            <div class="trailers__video-wrapper">
              <iframe
                v-if="item.site === 'YouTube'"
                :src="`https://www.youtube.com/embed/${item.key}`"
                :title="item.name"
                frameborder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowfullscreen
                class="trailers__video"
              />
              <div v-else class="trailers__video-fallback">
                <Text size="base">{{ item.name }}</Text>
                <Text size="sm" class="trailers__video-site">
                  Site: {{ item.site }}
                </Text>
              </div>
            </div>
            <Text size="base" weight="medium" class="trailers__video-title">
              {{ item.name }}
            </Text>
            <Text v-if="item.official" size="sm" class="trailers__official">
              Official
            </Text>
          </div>
        </template>
      </Carousel>
    </div>
    <div
      v-else-if="movie && movie.videos && movie.videos.results.length === 0"
      class="trailers__empty"
    >
      <Text size="base">No trailers available</Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { storeToRefs } from "pinia";
import { useMovieDetailsStore } from "@/stores/movie-details";
import { Text } from "@/shared/components/atoms/text";
import { Carousel } from "@/shared/components/organisms/carousel";

const movieDetailsStore = useMovieDetailsStore();
const { currentMovie } = storeToRefs(movieDetailsStore);

const movie = computed(() => currentMovie.value);

const trailers = computed(() => {
  if (!movie.value?.videos?.results) {
    return [];
  }

  // Filter for trailers (type === "Trailer")
  const trailerVideos = movie.value.videos.results.filter(
    (video) => video.type === "Trailer"
  );

  return trailerVideos;
});
</script>

<style scoped lang="scss">
.trailers {
  padding: 6rem 0;

  &__empty {
    text-align: center;
    padding: 2rem;
  }

  &__title {
    margin-bottom: 1.5rem;
  }

  &__carousel {
    margin-top: 1rem;
  }

  &__item {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    padding: 0.5rem;
  }

  &__video-wrapper {
    position: relative;
    width: 100%;
    padding-bottom: 56.25%; // 16:9 aspect ratio
    height: 0;
    overflow: hidden;
    border-radius: 8px;
    background: var(--color-bg-secondary, #1a1a1a);
  }

  &__video {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  &__video-fallback {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 1rem;
    text-align: center;
  }

  &__video-site {
    opacity: 0.7;
  }

  &__video-title {
    margin-top: 0.5rem;
  }

  &__official {
    color: var(--color-primary, #3b82f6);
    font-weight: 600;
  }
}
</style>
