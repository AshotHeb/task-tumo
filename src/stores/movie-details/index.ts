import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { MovieDetailsState, MovieDetailsGetters } from "./types";
import { getMovieById, getMovieVideos } from "@/api/entities/movies";
import type { MovieDetails } from "@/api/entities/movies/types";

export const useMovieDetailsStore = defineStore("movie-details", () => {
  // State
  const cachedMovies = ref<MovieDetailsState["cachedMovies"]>({});
  const isFetchMovieDetailsLoading =
    ref<MovieDetailsState["isFetchMovieDetailsLoading"]>(false);

  // Getters
  const getCachedMovie = computed<MovieDetailsGetters["getCachedMovie"]>(
    () => (id: number) => cachedMovies.value[id]
  );

  const isMovieCached = computed<MovieDetailsGetters["isMovieCached"]>(
    () => (id: number) => id in cachedMovies.value
  );

  // Actions
  function cacheMovie(movie: MovieDetails): void {
    cachedMovies.value[movie.id] = movie;
  }

  async function fetchMovieDetails(id: number): Promise<void> {
    // Check if movie is already cached
    if (cachedMovies.value[id]) {
      return;
    }

    // Set loading state
    isFetchMovieDetailsLoading.value = true;

    try {
      // Fetch movie details and videos in parallel using Promise.all
      const [movieResponse, videosResponse] = await Promise.all([
        getMovieById(id),
        getMovieVideos(id).catch((error) => {
          // If videos fetch fails, return null (videos are optional)
          console.warn(`Failed to fetch videos for movie ${id}:`, error);
          return { data: null };
        }),
      ]);

      const movieDetails = movieResponse.data;

      // Merge videos data into movie details
      if (videosResponse.data) {
        movieDetails.videos = videosResponse.data;
      }

      cacheMovie(movieDetails);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      throw error;
    } finally {
      isFetchMovieDetailsLoading.value = false;
    }
  }

  return {
    // State
    cachedMovies,
    isFetchMovieDetailsLoading,
    // Getters
    getCachedMovie,
    isMovieCached,
    // Actions
    fetchMovieDetails,
    cacheMovie,
  };
});

export type {
  MovieDetailsStore,
  MovieDetailsState,
  MovieDetailsGetters,
  MovieDetailsActions,
} from "./types";
