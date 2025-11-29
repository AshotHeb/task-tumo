/**
 * Movie entity from TMDb API
 */
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  original_title: string;
}

/**
 * TMDb API paginated response
 */
export interface MoviesResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

/**
 * Search movies query parameters
 */
export interface SearchMoviesParams {
  query: string;
  page?: number;
  language?: string;
}

/**
 * Popular movies query parameters
 */
export interface PopularMoviesParams {
  page?: number;
  language?: string;
}

