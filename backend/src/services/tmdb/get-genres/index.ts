import { IGenre } from '../../../../../shared/interfaces/movie/types';
import { fetchFromTMDB } from '../fetch-from-tmdb';

/**
    * Get popular movies from TMDB
    * @param limit - The number of movies to return
    * @returns A promise that resolves to an object containing popular movies
    * and pagination information
*/
export const getGenres = async (limit = 10 ): Promise<IGenre[]> => {
    try {
      const data = await fetchFromTMDB('/genre/movie/list', {
        language: 'en-US'
      });

      return data.genres;
    } catch (error) {
      console.error('❌ Error fetching genres:', error.message);
      throw error;
    }
  }