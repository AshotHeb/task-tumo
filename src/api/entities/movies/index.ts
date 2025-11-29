import { type AxiosResponse } from "axios";
import apiClient from "../../client";
import type {
  MovieDetails,
  MoviesResponse,
  SearchMoviesParams,
  PopularMoviesParams,
  VideosResponse,
  GenresResponse,
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
  return apiClient.get<MoviesResponse>(url);
}

/**
 * Search movies from TMDb API using Discover endpoint
 * @param params - Search parameters (with_text_query, with_genres, page, language)
 * @returns Promise with movies response
 */
export async function searchMovies(
  params: SearchMoviesParams
): Promise<AxiosResponse<MoviesResponse>> {
  const url = MOVIES_API_URLS.searchMovies({
    query: params.query,
    with_text_query: params.with_text_query,
    with_genres: params.with_genres,
    page: params.page,
    language: params.language,
  });
  // TMDb API returns data directly, not wrapped in ApiResponse
  return apiClient.get<MoviesResponse>(url);
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
  return apiClient.get<MovieDetails>(url);
}

/**
 * Get movie videos (trailers, teasers, etc.) from TMDb API
 * @param id - Movie ID
 * @param params - Query parameters (language)
 * @returns Promise with videos response
 */
export async function getMovieVideos(
  id: number,
  params?: { language?: string }
): Promise<AxiosResponse<VideosResponse>> {
  const url = MOVIES_API_URLS.getMovieVideos(id, params);
  // TMDb API returns data directly, not wrapped in ApiResponse
  return apiClient.get<VideosResponse>(url);
}

/**
 * Get movie genres list from TMDb API
 * @param params - Query parameters (language)
 * @returns Promise with genres response
 */
export async function getGenreList(params?: {
  language?: string;
}): Promise<AxiosResponse<GenresResponse>> {
  const url = MOVIES_API_URLS.getGenreList(params);
  // TMDb API returns data directly, not wrapped in ApiResponse
  return apiClient.get<GenresResponse>(url);
}

export type {
  Movie,
  MovieDetails,
  MoviesResponse,
  SearchMoviesParams,
  PopularMoviesParams,
  Genre,
  GenresResponse,
  ProductionCompany,
  ProductionCountry,
  SpokenLanguage,
  Video,
  VideosResponse,
} from "./types";
