/**
 * TMDb API base URL
 */
export const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";

/**
 * Get TMDb API key from environment variable
 */
export function getTmdbApiKey(): string {
  const apiKey = import.meta.env.VITE_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error(
      "VITE_TMDB_API_KEY is not defined. Please add it to your .env file."
    );
  }
  return apiKey;
}

/**
 * Build query parameters for TMDb API requests
 */
function buildQueryParams(
  params: Record<string, string | number | undefined>
): string {
  const searchParams = new URLSearchParams();
  searchParams.set("api_key", getTmdbApiKey());

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.set(key, String(value));
    }
  });

  return searchParams.toString();
}

/**
 * Movies API endpoints
 */
export const MOVIES_API_URLS = {
  /**
   * Get popular movies
   * @param params - Query parameters (page, language)
   * @returns Full URL with query parameters
   */
  getPopularMovies: (params?: { page?: number; language?: string }): string => {
    const queryString = buildQueryParams({
      page: params?.page || 1,
      language: params?.language || "en-US",
    });
    return `${TMDB_API_BASE_URL}/movie/popular?${queryString}`;
  },

  /**
   * Search movies
   * @param params - Query parameters (query, page, language)
   * @returns Full URL with query parameters
   */
  searchMovies: (params: {
    query: string;
    page?: number;
    language?: string;
  }): string => {
    const queryString = buildQueryParams({
      query: params.query,
      page: params.page || 1,
      language: params.language || "en-US",
    });
    return `${TMDB_API_BASE_URL}/search/movie?${queryString}`;
  },

  /**
   * Get movie by ID
   * @param id - Movie ID
   * @param params - Query parameters (language)
   * @returns Full URL with query parameters
   */
  getMovieById: (id: number, params?: { language?: string }): string => {
    const queryString = buildQueryParams({
      language: params?.language || "en-US",
    });
    return `${TMDB_API_BASE_URL}/movie/${id}?${queryString}`;
  },

  /**
   * Get movie videos (trailers, teasers, etc.)
   * @param id - Movie ID
   * @param params - Query parameters (language)
   * @returns Full URL with query parameters
   */
  getMovieVideos: (id: number, params?: { language?: string }): string => {
    const queryString = buildQueryParams({
      language: params?.language || "en-US",
    });
    return `${TMDB_API_BASE_URL}/movie/${id}/videos?${queryString}`;
  },
} as const;
