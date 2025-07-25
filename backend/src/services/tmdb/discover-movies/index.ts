import { IPopularMovies, IMovie } from '@shared/interfaces/movie/types';
import { fetchFromTMDB } from '../fetch-from-tmdb';

/**
 * Discover movies from TMDB with optional filtering
 * @param options - Options for discovering movies
 * @returns A promise that resolves to an object containing discovered movies
 */
export interface DiscoverMoviesOptions {
  page?: number;
  limit?: number;
  with_genres?: number | null; // Genre ID for filtering
  sort_by?: string;
  query?: string; // For search functionality
}

export const discoverMovies = async (options: DiscoverMoviesOptions = {}): Promise<IPopularMovies> => {
  try {
    const {
      page = 1,
      limit = 20,
      with_genres,
      sort_by = 'popularity.desc',
      query
    } = options;

    // If there's a search query, use search endpoint
    if (query && query.trim()) {
      const params: any = {
        query: query.trim(),
        language: 'en-US',
        page: page,
        include_adult: false
      };

      // Add genre filtering to search if specified
      if (with_genres) {
        params.with_genres = with_genres;
      }

      const data = await fetchFromTMDB('/search/movie', params);

      // Filter by genre if needed (since search doesn't support with_genres directly)
      let filteredResults = data.results;
      if (with_genres) {
        filteredResults = data.results.filter((movie: IMovie) => 
          movie.genre_ids && movie.genre_ids.includes(with_genres)
        );
      }

      const movies: IMovie[] = filteredResults.slice(0, limit).map((movie: any): IMovie => ({
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
        total_results: with_genres ? filteredResults.length : data.total_results,
        total_pages: Math.ceil((with_genres ? filteredResults.length : data.total_results) / limit),
        page: data.page
      };
    }

    // Use discover endpoint for popular/genre filtering
    const params: any = {
      language: 'en-US',
      page: page,
      sort_by: sort_by,
      include_adult: false,
      include_video: false
    };

    // Add genre filtering if specified
    if (with_genres) {
      params.with_genres = with_genres;
    }

    const data = await fetchFromTMDB('/discover/movie', params);

    // Transform and limit the results
    const movies: IMovie[] = data.results.slice(0, limit).map((movie: any): IMovie => ({
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
    console.error('❌ Error discovering movies:', error);
    throw error;
  }
};
