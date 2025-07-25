import { useInfiniteQuery } from '@tanstack/react-query';
import type { IApiResponse, ISearchMoviesResponse } from '../../../../../shared/interfaces/movie/types';
import { config } from '@/config';

// Fetch search movies with pagination
const fetchSearchMoviesPage = async ({ 
  pageParam = 1, 
  query,
  limit = 20 
}: { 
  pageParam?: number; 
  query: string;
  limit?: number; 
}): Promise<IApiResponse<ISearchMoviesResponse>> => {
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

  const response = await fetch(`${config.api.baseUrl}/movies/search?q=${encodeURIComponent(query)}&limit=${limit}&page=${pageParam}`);
  
  if (!response.ok) {
    throw new Error(`Failed to search movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// React Query infinite hook for searching movies
export const useInfiniteSearchMovies = (query: string, limit: number = 20) => {
  return useInfiniteQuery({
    queryKey: ['infiniteSearchMovies', query, limit],
    queryFn: ({ pageParam }) => fetchSearchMoviesPage({ pageParam, query, limit }),
    initialPageParam: 1,
    enabled: !!query && query.trim().length > 0, // Only run query if there's a search term
    getNextPageParam: (lastPage) => {
      const { page, total_pages } = lastPage.data;
      return page < total_pages ? page + 1 : undefined;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};