import type { IMovie } from '../../../shared/interfaces/movie/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Calendar } from 'lucide-react';

interface MovieListItemProps {
  movie: IMovie;
}

export const MovieListItem = ({ movie }: MovieListItemProps) => {
  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="relative overflow-hidden">
        {movie.poster_path ? (
          <img 
            src={movie.poster_path} 
            alt={`${movie.title} poster`}
            className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-[400px] bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">No Image Available</span>
          </div>
        )}
        
        {/* Rating Badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="bg-black/70 text-white">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
          </Badge>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="text-lg line-clamp-2">{movie.title}</CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="w-4 h-4" />
          {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown'}
          <span className="text-xs">•</span>
          <span>{movie.vote_count || 0} votes</span>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <CardDescription className="line-clamp-3">
          {movie.overview || 'No description available.'}
        </CardDescription>
      </CardContent>
    </Card>
  );
};
