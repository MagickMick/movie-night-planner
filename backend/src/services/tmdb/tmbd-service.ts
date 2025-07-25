import { fetchFromTMDB } from './fetch-from-tmdb';
import { getPopularMovies } from './get-popular-movies';
import { getGenres } from './get-genres';
import { searchMovies } from './search-movies';
import { discoverMovies } from './discover-movies';

/**
 * Modulaire TMDB Service
 * Exports alle TMDB gerelateerde functies
 */
export const TmdbService = {
  getPopularMovies,
  searchMovies,
  getGenres,
  discoverMovies,
  fetchFromTMDB // Voor direct gebruik indien nodig
};