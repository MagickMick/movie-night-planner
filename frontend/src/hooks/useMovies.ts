import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { IApiResponse, IPopularMovies } from '../../../shared/interfaces/movie/types';

const API_BASE_URL = 'http://localhost:3000/api';

// Fetch popular movies from the backend
const fetchPopularMovies = async (limit: number = 10): Promise<IApiResponse<IPopularMovies>> => {
  const response = await fetch(`${API_BASE_URL}/movies/popular?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch popular movies with pagination
const fetchPopularMoviesPage = async ({ 
  pageParam = 1, 
  limit = 20 
}: { 
  pageParam?: number; 
  limit?: number; 
}): Promise<IApiResponse<IPopularMovies>> => {
  const response = await fetch(`${API_BASE_URL}/movies/popular?limit=${limit}&page=${pageParam}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// React Query hook for popular movies (legacy)
export const usePopularMovies = (limit: number = 10) => {
  return useQuery({
    queryKey: ['popularMovies', limit],
    queryFn: () => fetchPopularMovies(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
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

// Export the fetch functions for potential reuse
export { fetchPopularMovies, fetchPopularMoviesPage };
