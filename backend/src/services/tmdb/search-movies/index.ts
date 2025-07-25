import { ISearchMoviesResponse } from '@shared/interfaces/movie/types';
import { fetchFromTMDB } from '../fetch-from-tmdb';

/**
    * search movies from TMDB
    * @param query - The search query for movies
    * @param limit - The number of movies to return
    * @returns A promise that resolves to an object containing search results
    * and pagination information
*/
export const searchMovies = async (query: string, limit = 10): Promise<ISearchMoviesResponse> => {
    try {
      if (!query || query.trim() === '') {
        return {
          movies: [],
          total_results: 0,
          total_pages: 0,
          page: 1,
          query: ''
        };
      }
      
      const data = await fetchFromTMDB('/search/movie', {
        query: query.trim(),
        language: 'en-US',
        page: 1,
        include_adult: false
      });

      // Transform and limit the results
      const movies = data.results.slice(0, limit).map((movie: any) => ({
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
        page: data.page,
        query
      };
    } catch (error) {
      console.error('❌ Error searching movies:', error instanceof Error ? error.message : error);
      throw error;
    }
  }