import axios, { type AxiosResponse } from "axios";
import type {
  Movie,
  MovieDetails,
  MoviesResponse,
  SearchMoviesParams,
  PopularMoviesParams,
} from "./types";
import { MOVIES_API_URLS } from "./consts";

/**
 * Fetch popular movies from TMDb API
 * @param params - Query parameters (page, language)
 * @returns Promise with movies response
 */
export async function getPopularMovies(
  params?: PopularMoviesParams
): Promise<AxiosResponse<MoviesResponse>> {
  const url = MOVIES_API_URLS.getPopularMovies({
    page: params?.page,
    language: params?.language,
  });
  // TMDb API returns data directly, not wrapped in ApiResponse
  return axios.get<MoviesResponse>(url);
}

/**
 * Search movies from TMDb API
 * @param params - Search parameters (query, page, language)
 * @returns Promise with movies response
 */
export async function searchMovies(
  params: SearchMoviesParams
): Promise<AxiosResponse<MoviesResponse>> {
  const url = MOVIES_API_URLS.searchMovies({
    query: params.query,
    page: params.page,
    language: params.language,
  });
  // TMDb API returns data directly, not wrapped in ApiResponse
  return axios.get<MoviesResponse>(url);
}

/**
 * Get movie details by ID from TMDb API
 * @param id - Movie ID
 * @param params - Query parameters (language)
 * @returns Promise with movie details
 */
export async function getMovieById(
  id: number,
  params?: { language?: string }
): Promise<AxiosResponse<MovieDetails>> {
  const url = MOVIES_API_URLS.getMovieById(id, params);
  // TMDb API returns data directly, not wrapped in ApiResponse
  return axios.get<MovieDetails>(url);
}

export type {
  Movie,
  MovieDetails,
  MoviesResponse,
  SearchMoviesParams,
  PopularMoviesParams,
  Genre,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
} from "./types";
