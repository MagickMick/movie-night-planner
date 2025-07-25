import { IGenre } from '@shared/interfaces/movie/types';
import { fetchFromTMDB } from '../fetch-from-tmdb';

/**
 * Get movie genres from TMDB
 * @returns A promise that resolves to an array of genres
 */
export const getGenres = async (): Promise<IGenre[]> => {
  try {
    const data = await fetchFromTMDB('/genre/movie/list', {
      language: 'en-US'
    });

    return data.genres;
  } catch (error) {
    console.error('❌ Error fetching genres:', error instanceof Error ? error.message : error);
    throw error;
  }
};