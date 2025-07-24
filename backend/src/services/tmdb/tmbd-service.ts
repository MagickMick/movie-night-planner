import { fetchFromTMDB } from './fetch-from-tmdb';
import { getPopularMovies } from './get-popular-movies';
import { getGenres } from './get-genres';
import { searchMovies } from './search-movies';

/**
 * TMDB Service
*/
export const TmdbService = {
  fetchFromTMDB,
  getPopularMovies,
  getGenres,
  searchMovies
};