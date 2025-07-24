import { fetchFromTMDB } from './fetch-from-tmdb';
import { getPopularMovies } from './get-popular-movies';
import { getGenres } from './get-genres';
import { searchMovies } from './search-movies';

/**
 * Modulaire TMDB Service
 * Exports alle TMDB gerelateerde functies
 */
export const TmdbService = {
  getPopularMovies,
  searchMovies,
  getGenres,
  fetchFromTMDB // Voor direct gebruik indien nodig
};