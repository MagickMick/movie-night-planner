import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useDebounce } from '@/hooks/useDebounce';
import { MovieHook } from '../hooks/movie/movie-hook';
import { SearchBar } from './SearchBar';
import { MovieListItem } from './MovieListItem';
import { Loader2, AlertCircle, Film } from 'lucide-react';

interface MovieSearchAndListProps {
  limit?: number;
}

/**
 * @deprecated This component is deprecated. Use MovieList with SearchBar instead.
 * @see {@link MovieList} and {@link SearchBar}
 */
export const MovieSearchAndList = ({ limit = 20 }: MovieSearchAndListProps) => {
  const [searchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 500);
  
  // Search query hook - only runs when there's a search term
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    isError: isSearchError,
    fetchNextPage: fetchNextSearchPage,
    hasNextPage: hasNextSearchPage,
    isFetchingNextPage: isFetchingNextSearchPage,
  } = MovieHook.useInfiniteSearchMovies(debouncedSearchQuery, limit);

  // Popular movies hook - only runs when there's no search term
  const {
    data: popularData,
    isLoading: isPopularLoading,
    error: popularError,
    isError: isPopularError,
    fetchNextPage: fetchNextPopularPage,
    hasNextPage: hasNextPopularPage,
    isFetchingNextPage: isFetchingNextPopularPage,
  } = MovieHook.useInfinitePopularMovies(limit);

  const { ref, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Determine which data to show
  const isSearching = debouncedSearchQuery.trim().length > 0;
  const isLoading = isSearching ? isSearchLoading : isPopularLoading;
  const isError = isSearching ? isSearchError : isPopularError;
  const error = isSearching ? searchError : popularError;
  const fetchNextPage = isSearching ? fetchNextSearchPage : fetchNextPopularPage;
  const hasNextPage = isSearching ? hasNextSearchPage : hasNextPopularPage;
  const isFetchingNextPage = isSearching ? isFetchingNextSearchPage : isFetchingNextPopularPage;

  // Get movies array
  const movies = isSearching 
    ? searchData?.pages.flatMap(page => page.data.movies) || []
    : popularData?.pages.flatMap(page => page.data.movies) || [];

  const totalResults = isSearching 
    ? searchData?.pages[0]?.data.total_results || 0
    : popularData?.pages[0]?.data.total_results || 0;

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
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search for movies..."
            className="max-w-2xl mx-auto"
          />
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">
            {isSearching ? `Searching for "${debouncedSearchQuery}"...` : 'Loading popular movies...'}
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar
            placeholder="Search for movies..."
            className="max-w-2xl mx-auto"
          />
        </div>
        
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
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <SearchBar  
            placeholder="Search for movies..."
            className="max-w-2xl mx-auto"
          />
        </div>
        
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
          <Film className="w-12 h-12 text-muted-foreground" />
          <div>
            <h3 className="text-lg font-semibold mb-2">
              {isSearching ? 'No movies found' : 'No movies available'}
            </h3>
            <p className="text-muted-foreground">
              {isSearching 
                ? `No results found for "${debouncedSearchQuery}". Try a different search term.`
                : "We couldn't find any movies at the moment."
              }
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <SearchBar 
          placeholder="Search for movies..."
          className="max-w-2xl mx-auto"
        />
      </div>
      
      {/* Results Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">
          {isSearching ? `Search Results for "${debouncedSearchQuery}"` : 'Popular Movies'}
        </h2>
        <p className="text-muted-foreground">
          Showing {movies.length} of {totalResults.toLocaleString()} movies
        </p>
      </div>
      
      {/* Movies Grid */}
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
