import { usePopularMovies } from '@/hooks/useMovies';
import { MovieListItem } from './MovieListItem';
import { Loader2, AlertCircle, Film } from 'lucide-react';

interface MovieListProps {
  limit?: number;
}

export const MovieList = ({ limit = 10 }: MovieListProps) => {
  const { data, isLoading, error, isError } = usePopularMovies(limit);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading popular movies...</p>
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

  if (!data?.data?.movies || data.data.movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4 text-center">
        <Film className="w-12 h-12 text-muted-foreground" />
        <div>
          <h3 className="text-lg font-semibold mb-2">No movies found</h3>
          <p className="text-muted-foreground">We couldn't find any popular movies at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Popular Movies</h2>
        <p className="text-muted-foreground">
          Showing {data.data.movies.length} of {data.data.total_results.toLocaleString()} movies
        </p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {data.data.movies.map((movie) => (
          <MovieListItem key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
};
