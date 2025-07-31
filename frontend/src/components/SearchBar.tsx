import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Search, X, ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { searchQueryAtom, selectedGenreAtom, scoreSortAtom } from '@/stores/movieStore';
import { useGenres } from '@/hooks/useGenres';
import { useClickOutside } from '@/hooks/useClickOutside';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ placeholder = "Search movies...", className = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedGenre, setSelectedGenre] = useAtom(selectedGenreAtom);
  const [scoreSort, setScoreSort] = useAtom(scoreSortAtom);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  const [isScoreSortDropdownOpen, setIsScoreSortDropdownOpen] = useState(false);
  
  const { data: genres, isLoading: isLoadingGenres } = useGenres();

  // Close dropdown when clicking outside
  const genreDropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsGenreDropdownOpen(false);
  });

  const scoreSortDropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsScoreSortDropdownOpen(false);
  });

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalQuery(value);
    setSearchQuery(value);
  };

  const handleClear = () => {
    setLocalQuery('');
    setSearchQuery('');
  };

  const handleGenreSelect = (genreId: number | null) => {
    setSelectedGenre(genreId);
    setIsGenreDropdownOpen(false);
  };

  const handleScoreSortSelect = (sort: 'asc' | 'desc' | null) => {
    setScoreSort(sort);
    setIsScoreSortDropdownOpen(false);
  };

  const selectedGenreName = selectedGenre 
    ? genres?.find(genre => genre.id === selectedGenre)?.name 
    : 'All Genres';

  const scoreSortLabel = scoreSort === 'asc' ? 'Score: Low to High' : 
                        scoreSort === 'desc' ? 'Score: High to Low' : 
                        'Sort by Score';

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Horizontal Layout with Search, Genre, and Score Sort */}
      <div className="flex flex-col lg:flex-row gap-4 w-full">
        {/* Search Input */}
        <div className="relative flex-1 min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={localQuery}
            onChange={handleInputChange}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-200 text-foreground placeholder-muted-foreground"
          />
          {localQuery && (
            <button
              onClick={handleClear}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full transition-colors"
              type="button"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>

        {/* Genre Dropdown */}
        <div className="relative w-full lg:w-64 lg:flex-shrink-0" ref={genreDropdownRef}>
          <button
            onClick={() => setIsGenreDropdownOpen(!isGenreDropdownOpen)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            disabled={isLoadingGenres}
          >
            <span className="text-foreground">
              {isLoadingGenres ? 'Loading genres...' : selectedGenreName}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isGenreDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isGenreDropdownOpen && genres && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
              <button
                onClick={() => handleGenreSelect(null)}
                className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                  selectedGenre === null ? 'bg-muted font-medium' : ''
                }`}
              >
                All Genres
              </button>
              {genres.map((genre) => (
                <button
                  key={genre.id}
                  onClick={() => handleGenreSelect(genre.id)}
                  className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors ${
                    selectedGenre === genre.id ? 'bg-muted font-medium' : ''
                  }`}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Score Sort Dropdown */}
        <div className="relative w-full lg:w-56 lg:flex-shrink-0" ref={scoreSortDropdownRef}>
          <button
            onClick={() => setIsScoreSortDropdownOpen(!isScoreSortDropdownOpen)}
            className="w-full px-4 py-3 bg-background border border-border rounded-lg flex items-center justify-between hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <span className="text-foreground flex items-center gap-2">
              {scoreSort === 'asc' && <ArrowUp className="h-4 w-4" />}
              {scoreSort === 'desc' && <ArrowDown className="h-4 w-4" />}
              {!scoreSort && <ArrowUpDown className="h-4 w-4" />}
              {scoreSortLabel}
            </span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${isScoreSortDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {isScoreSortDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-background border border-border rounded-lg shadow-lg z-50">
              <button
                onClick={() => handleScoreSortSelect(null)}
                className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                  scoreSort === null ? 'bg-muted font-medium' : ''
                }`}
              >
                <ArrowUpDown className="h-4 w-4" />
                No Sort
              </button>
              <button
                onClick={() => handleScoreSortSelect('desc')}
                className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                  scoreSort === 'desc' ? 'bg-muted font-medium' : ''
                }`}
              >
                <ArrowDown className="h-4 w-4" />
                Score: High to Low
              </button>
              <button
                onClick={() => handleScoreSortSelect('asc')}
                className={`w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 ${
                  scoreSort === 'asc' ? 'bg-muted font-medium' : ''
                }`}
              >
                <ArrowUp className="h-4 w-4" />
                Score: Low to High
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Active Filters Display */}
      {(localQuery || selectedGenre || scoreSort) && (
        <div className="flex flex-wrap gap-2">
          {localQuery && (
            <div className="flex items-center gap-1 bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              <Search className="h-3 w-3" />
              <span>"{localQuery}"</span>
              <button
                onClick={handleClear}
                className="hover:bg-primary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {selectedGenre && (
            <div className="flex items-center gap-1 bg-secondary/10 text-secondary-foreground px-3 py-1 rounded-full text-sm">
              <span>{selectedGenreName}</span>
              <button
                onClick={() => handleGenreSelect(null)}
                className="hover:bg-secondary/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          {scoreSort && (
            <div className="flex items-center gap-1 bg-accent/10 text-accent-foreground px-3 py-1 rounded-full text-sm">
              {scoreSort === 'asc' && <ArrowUp className="h-3 w-3" />}
              {scoreSort === 'desc' && <ArrowDown className="h-3 w-3" />}
              <span>{scoreSortLabel}</span>
              <button
                onClick={() => handleScoreSortSelect(null)}
                className="hover:bg-accent/20 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
