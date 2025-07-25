import { useQuery } from '@tanstack/react-query';
import { config } from '@/config';
import type { IGenre, IApiResponse, IGenresResponse } from '../../../shared/interfaces/movie/types';

const fetchGenres = async (): Promise<IGenre[]> => {
  const url = `${config.api.baseUrl}/movies/genres`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch genres: ${response.status} ${response.statusText}`);
  }
  
  const result: IApiResponse<IGenresResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch genres');
  }
  
  return result.data.genres;
};

export const useGenres = () => {
  return useQuery({
    queryKey: ['genres'],
    queryFn: fetchGenres,
    staleTime: 1000 * 60 * 60, // 1 hour - genres don't change often
    gcTime: 1000 * 60 * 60 * 2, // 2 hours
  });
};
