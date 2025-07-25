import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import type { IApiResponse, IPopularMovies, ISearchMoviesResponse } from '../../../shared/interfaces/movie/types';
import { config } from '@/config';

// Fetch popular movies from the backend
//DONE
const fetchPopularMovies = async (limit: number = 10): Promise<IApiResponse<IPopularMovies>> => {
  const response = await fetch(`${config.api.baseUrl}/movies/popular?limit=${limit}`);
  
  if (!response.ok) {
    throw new Error(`Failed to fetch popular movies: ${response.status} ${response.statusText}`);
  }
  
  return response.json();
};

// Fetch popular movies with pagination
//DONE
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

// React Query hook for popular movies (legacy)
//DONE
export const usePopularMovies = (limit: number = 10) => {
  return useQuery({
    queryKey: ['popularMovies', limit],
    queryFn: () => fetchPopularMovies(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// React Query infinite hook for popular movies
//DONE
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

// Fetch search movies from the backend
//DONE
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

// Fetch search movies with pagination
//DONE
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

// React Query hook for searching movies
//DONE
export const useSearchMovies = (query: string, limit: number = 20) => {
  return useQuery({
    queryKey: ['searchMovies', query, limit],
    queryFn: () => fetchSearchMovies(query, limit),
    enabled: !!query && query.trim().length > 0, // Only run query if there's a search term
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};

// React Query infinite hook for searching movies
//DONE
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
