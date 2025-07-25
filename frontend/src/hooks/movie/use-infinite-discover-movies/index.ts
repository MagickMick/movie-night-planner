import { useInfiniteQuery } from '@tanstack/react-query';
import { config } from '@/config';
import type { IApiResponse, IPopularMovies } from '../../../../../shared/interfaces/movie/types';

interface DiscoverMoviesParams {
  query?: string;
  with_genres?: number | null;
  limit?: number;
}

const fetchDiscoverMovies = async ({ 
  pageParam = 1, 
  query = '', 
  with_genres = null,
  limit = 20 
}: { pageParam: number } & DiscoverMoviesParams): Promise<IPopularMovies> => {
  const url = new URL(`${config.api.baseUrl}/movies/discover`);
  
  url.searchParams.append('page', pageParam.toString());
  url.searchParams.append('limit', limit.toString());
  
  if (query) {
    url.searchParams.append('query', query);
  }
  
  if (with_genres) {
    url.searchParams.append('with_genres', with_genres.toString());
  }

  console.log('🔍 Fetching discover movies:', url.toString());

  const response = await fetch(url.toString());
  
  if (!response.ok) {
    throw new Error(`Failed to fetch movies: ${response.status} ${response.statusText}`);
  }
  
  const result: IApiResponse<IPopularMovies> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch movies');
  }
  
  return result.data;
};

export const useInfiniteDiscoverMovies = (params: DiscoverMoviesParams) => {
  const { query = '', with_genres = null, limit = 20 } = params;
  
  return useInfiniteQuery({
    queryKey: ['discoverMovies', query, with_genres, limit],
    queryFn: ({ pageParam = 1 }) => 
      fetchDiscoverMovies({ pageParam, query, with_genres, limit }),
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
  });
};
