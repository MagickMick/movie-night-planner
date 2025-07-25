import { useQuery } from '@tanstack/react-query';
import type { IApiResponse, IPopularMovies } from '../../../../../shared/interfaces/movie/types';
import { config } from '@/config';

// Fetch popular movies from the backend
const fetchPopularMovies = async (limit: number = 10): Promise<IApiResponse<IPopularMovies>> => {
  const response = await fetch(`${config.api.baseUrl}/movies/popular?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

export const usePopularMovies = (limit: number = 10) => {
  return useQuery({
    queryKey: ['popularMovies', limit],
    queryFn: () => fetchPopularMovies(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};