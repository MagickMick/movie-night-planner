import { useMemo, useCallback, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { useInView } from 'react-intersection-observer';
import { MovieHook } from '../hooks/movie/movie-hook';
import { MovieListItem } from './MovieListItem';
import { movieFiltersAtom } from '@/stores/movieStore';
import { Loader2, AlertCircle, Film } from 'lucide-react';

interface MovieListProps {
  limit?: number;
}

export const MovieList = ({ limit = 20 }: MovieListProps) => {
  const filters = useAtomValue(movieFiltersAtom);
  const { searchQuery, selectedGenre, scoreSort } = filters;

  // Convert scoreSort to TMDB API format
  const getSortBy = (scoreSort: 'asc' | 'desc' | null): string => {
    if (scoreSort === 'asc') return 'vote_average.asc';
    if (scoreSort === 'desc') return 'vote_average.desc';
    return 'popularity.desc'; // Default sort
  };

  // Use the new discover movies hook that handles both search and genre filtering
  const {
    data,
    isLoading,
    error,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = MovieHook.useInfiniteDiscoverMovies({
    query: searchQuery,
    with_genres: selectedGenre,
    limit,
    sort_by: getSortBy(scoreSort)
  });

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Get all movies from all pages (no need for frontend sorting anymore)
  const movies = useMemo(() => {
    return data?.pages.flatMap(page => page.movies) || [];
  }, [data]);

  const totalResults = data?.pages[0]?.total_results || 0;

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">
          {searchQuery ? `Searching for "${searchQuery}"...` : 'Loading movies...'}
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 max-w-md mx-auto text-center">
        <AlertCircle className="w-12 h-12 text-destructive" />
        <div>
          <h3 className="text-lg font-semibold mb-2">Error loading movies</h3>
          <p className="text-muted-foreground mb-4">
            {error instanceof Error ? error.message : 'Something went wrong while fetching movies.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <Film className="w-12 h-12 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold mb-2">No movies found</h3>
          <p className="text-muted-foreground">
            {searchQuery && selectedGenre
              ? `No results found for "${searchQuery}" in the selected genre.`
              : searchQuery
              ? `No results found for "${searchQuery}".`
              : selectedGenre
              ? 'No movies found in the selected genre.'
              : "We couldn't find any movies at the moment."
            }
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Movies'}
          {scoreSort && (
            <span className="text-lg font-normal text-muted-foreground ml-2">
              • Sorted by Score ({scoreSort === 'asc' ? 'Low to High' : 'High to Low'})
            </span>
          )}
        </h2>
        <p className="text-muted-foreground">
          Showing {movies.length} of {totalResults.toLocaleString()} movies
          {selectedGenre && ` in selected genre`}
          {scoreSort && ` sorted by rating ${scoreSort === 'asc' ? '↑' : '↓'}`}
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie, index) => (
          <MovieListItem key={`${movie.id}-${index}`} movie={movie} />
        ))}
      </div>

      {/* Intersection observer trigger for infinite scroll */}
      <div ref={ref} className="flex justify-center py-8">
        {isFetchingNextPage && (
          <div className="flex items-center gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading more movies...</p>
          </div>
        )}
        {!hasNextPage && movies.length > 0 && (
          <p className="text-muted-foreground">🎬 You've reached the end! No more movies to load.</p>
        )}
      </div>
    </div>
  );
};
