import { IPopularMovies } from '../../../../../shared/interfaces/movie/types';
import { fetchFromTMDB } from '../fetch-from-tmdb';

/**
    * Get popular movies from TMDB
    * @param limit - The number of movies to return
    * @returns A promise that resolves to an object containing popular movies
    * and pagination information
*/
export const getPopularMovies = async (limit = 10 ): Promise<IPopularMovies> => {
    try {
      const data = await fetchFromTMDB('/movie/popular', {
        language: 'en-US',
        page: 1
      });

      // Transform and limit the results
      const movies = data.results.slice(0, limit).map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids,
        adult: movie.adult,
        original_language: movie.original_language,
        popularity: movie.popularity
      }));

      return {
        movies,
        total_results: data.total_results,
        total_pages: data.total_pages,
        page: data.page
      };
    } catch (error) {
      console.error('❌ Error fetching popular movies:', error.message);
      throw error;
    }
  }