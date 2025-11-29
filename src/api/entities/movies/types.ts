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

/**
 * Genre entity from TMDb API
 */
export interface Genre {
  id: number;
  name: string;
}

/**
 * Production company entity from TMDb API
 */
export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

/**
 * Production country entity from TMDb API
 */
export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

/**
 * Spoken language entity from TMDb API
 */
export interface SpokenLanguage {
  english_name: string;
  iso_639_1: string;
  name: string;
}

/**
 * Video entity from TMDb API
 */
export interface Video {
  id: string;
  iso_639_1: string;
  iso_3166_1: string;
  key: string;
  name: string;
  official: boolean;
  published_at: string;
  site: string;
  size: number;
  type: string;
}

/**
 * Videos response from TMDb API
 */
export interface VideosResponse {
  id: number;
  results: Video[];
}

/**
 * Full movie details from TMDb API (includes additional fields)
 */
export interface MovieDetails extends Movie {
  genres: Genre[];
  runtime: number;
  budget: number;
  revenue: number;
  production_companies: ProductionCompany[];
  production_countries: ProductionCountry[];
  spoken_languages: SpokenLanguage[];
  status: string;
  tagline: string | null;
  homepage: string | null;
  imdb_id: string | null;
  belongs_to_collection: {
    id: number;
    name: string;
    poster_path: string | null;
    backdrop_path: string | null;
  } | null;
  videos?: VideosResponse;
}


