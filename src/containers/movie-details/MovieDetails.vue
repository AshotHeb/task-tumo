<template>
  <div class="movie-details">
    <div v-if="isLoading" class="movie-details__loading">
      <Loader size="lg" />
    </div>
    <div v-else-if="movie" class="movie-details__content">
      <div class="movie-details__container">
        <!-- Back Button -->
        <button
          type="button"
          class="movie-details__back-button"
          @click="handleBack"
        >
          <ArrowLeft :size="20" />
          <span>Back to Movies</span>
        </button>

        <!-- Main Content -->
        <div class="movie-details__main">
          <Favorite
            v-if="movie"
            :is-favorite="isFavorite"
            :on-click="handleFavoriteClick"
            class="movie-details__favorite"
          />
          <!-- Poster -->
          <div class="movie-details__poster">
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              class="movie-details__poster-image"
            />
            <div v-else class="movie-details__no-poster">No Image</div>
          </div>

          <!-- Info Section -->
          <div class="movie-details__info">
            <div class="movie-details__header">
              <Text
                as="h1"
                size="2xl"
                weight="bold"
                class="movie-details__title"
              >
                {{ movie.title }}
              </Text>
              <Text
                v-if="movie.tagline"
                size="lg"
                class="movie-details__tagline"
              >
                {{ movie.tagline }}
              </Text>
            </div>

            <!-- Meta Information -->
            <div class="movie-details__meta">
              <div class="movie-details__rating">
                <span class="movie-details__star">★</span>
                <Text size="lg" weight="semibold">
                  {{ movie.vote_average.toFixed(1) }}
                </Text>
                <Text size="sm" class="movie-details__vote-count">
                  ({{ movie.vote_count.toLocaleString() }} votes)
                </Text>
              </div>
              <div class="movie-details__release-date">
                <Text size="base" weight="medium">Release Date:</Text>
                <Text size="base">{{ formatDate(movie.release_date) }}</Text>
              </div>
              <div v-if="movie.runtime" class="movie-details__runtime">
                <Text size="base" weight="medium">Runtime:</Text>
                <Text size="base">{{ formatRuntime(movie.runtime) }}</Text>
              </div>
            </div>

            <!-- Genres -->
            <div
              v-if="movie.genres && movie.genres.length > 0"
              class="movie-details__genres"
            >
              <Text
                size="base"
                weight="medium"
                class="movie-details__genres-label"
              >
                Genres:
              </Text>
              <div class="movie-details__genres-list">
                <span
                  v-for="genre in movie.genres"
                  :key="genre.id"
                  class="movie-details__genre-tag"
                >
                  {{ genre.name }}
                </span>
              </div>
            </div>

            <!-- Overview -->
            <div v-if="movie.overview" class="movie-details__overview">
              <Text
                size="lg"
                weight="semibold"
                class="movie-details__overview-title"
              >
                Overview
              </Text>
              <Text size="base" class="movie-details__overview-text">
                {{ movie.overview }}
              </Text>
            </div>

            <!-- Additional Info -->
            <div class="movie-details__additional">
              <div
                v-if="
                  movie.production_companies &&
                  movie.production_companies.length > 0
                "
                class="movie-details__production"
              >
                <Text
                  size="base"
                  weight="medium"
                  class="movie-details__production-label"
                >
                  Production Companies:
                </Text>
                <Text size="sm" class="movie-details__production-companies">
                  {{ movie.production_companies.map((c) => c.name).join(", ") }}
                </Text>
              </div>
              <div
                v-if="
                  movie.production_countries &&
                  movie.production_countries.length > 0
                "
                class="movie-details__countries"
              >
                <Text
                  size="base"
                  weight="medium"
                  class="movie-details__countries-label"
                >
                  Production Countries:
                </Text>
                <Text size="sm" class="movie-details__countries-list">
                  {{ movie.production_countries.map((c) => c.name).join(", ") }}
                </Text>
              </div>
            </div>
          </div>
        </div>
        <Trailers />
      </div>
    </div>
    <div v-else class="movie-details__error">
      <Text size="lg" weight="semibold">Movie not found</Text>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import { ArrowLeft } from "lucide-vue-next";
import { useMovieDetailsStore } from "@/stores/movie-details";
import { useFavoritesStore } from "@/stores/favorites";
import { Loader } from "@/shared/components/atoms/loader";
import { Text } from "@/shared/components/atoms/text";
import { Favorite } from "@/shared/components/atoms/favorite";
import { Trailers } from "./trailers";

const route = useRoute();
const router = useRouter();
const movieDetailsStore = useMovieDetailsStore();
const favoritesStore = useFavoritesStore();
const { currentMovie, isFetchMovieDetailsLoading } =
  storeToRefs(movieDetailsStore);
const { fetchMovieDetails, setCurrentMovieId } = movieDetailsStore;

const movieId = computed(() => {
  const id = route.params.id;
  return typeof id === "string" ? parseInt(id, 10) : Number(id);
});

const movie = computed(() => currentMovie.value);

const isLoading = computed(() => {
  return isFetchMovieDetailsLoading.value || (!movie.value && movieId.value);
});

const isFavorite = computed(() => {
  return movie.value ? favoritesStore.isFavorite(movie.value.id) : false;
});

function handleFavoriteClick(): void {
  if (movie.value) {
    favoritesStore.toggleFavorite(movie.value);
  }
}

const formatDate = (dateString: string): string => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const formatRuntime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
};

const handleBack = (): void => {
  router.push("/");
};

// Set currentMovieId from route params and fetch movie details
watch(
  movieId,
  async (newId) => {
    if (newId && !isNaN(newId)) {
      setCurrentMovieId(newId);
      await fetchMovieDetails(newId);
    } else {
      setCurrentMovieId(null);
    }
  },
  { immediate: true }
);

onMounted(async () => {
  if (movieId.value && !isNaN(movieId.value)) {
    setCurrentMovieId(movieId.value);
    await fetchMovieDetails(movieId.value);
  } else {
    setCurrentMovieId(null);
  }
});
</script>

<style scoped lang="scss">
@import "./styles.scss";
</style>
