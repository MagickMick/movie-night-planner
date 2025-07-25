import { useInfiniteQuery } from '@tanstack/react-query';
import type { IApiResponse, IPopularMovies } from '../../../../../shared/interfaces/movie/types';
import { config } from '@/config';

// Fetch popular movies with pagination
const fetchPopularMoviesPage = async ({ 
  pageParam = 1, 
  limit = 20 
}: { 
  pageParam?: number; 
  limit?: number; 
}): Promise<IApiResponse<IPopularMovies>> => {
  const response = await fetch(`${config.api.baseUrl}/movies/popular?limit=${limit}&page=${pageParam}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};


// React Query infinite hook for popular movies
export const useInfinitePopularMovies = (limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['infinitePopularMovies', limit],
    queryFn: ({ pageParam }) => fetchPopularMoviesPage({ pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data;
      return page < total_pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};