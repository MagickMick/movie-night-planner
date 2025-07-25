import { useQuery } from '@tanstack/react-query';
import type { IApiResponse, ISearchMoviesResponse } from '../../../../../shared/interfaces/movie/types';
import { config } from '@/config';

// Fetch search movies from the backend
const fetchSearchMovies = async (query: string, limit: number = 20): Promise<IApiResponse<ISearchMoviesResponse>> => {
  if (!query || query.trim() === '') {
    return {
      success: true,
      data: {
        movies: [],
        total_results: 0,
        total_pages: 0,
        page: 1,
        query: ''
      },
      message: 'Empty query'
    };
  }

  const response = await fetch(`${config.api.baseUrl}/movies/search?q=${encodeURIComponent(query)}&limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to search movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// React Query hook for searching movies
export const useSearchMovies = (query: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['searchMovies', query, limit],
    queryFn: () => fetchSearchMovies(query, limit),
    enabled: !!query && query.trim().length > 0, // Only run query if there's a search term
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};