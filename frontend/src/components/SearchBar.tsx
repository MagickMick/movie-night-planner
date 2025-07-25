import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { Search, X, ChevronDown } from 'lucide-react';
import { searchQueryAtom, selectedGenreAtom } from '@/stores/movieStore';
import { useGenres } from '@/hooks/useGenres';
import { useClickOutside } from '@/hooks/useClickOutside';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export const SearchBar = ({ placeholder = "Search movies...", className = "" }: SearchBarProps) => {
  const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
  const [selectedGenre, setSelectedGenre] = useAtom(selectedGenreAtom);
  const [localQuery, setLocalQuery] = useState(searchQuery);
  const [isGenreDropdownOpen, setIsGenreDropdownOpen] = useState(false);
  
  const { data: genres, isLoading: isLoadingGenres } = useGenres();

  // Close dropdown when clicking outside
  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsGenreDropdownOpen(false);
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

  const selectedGenreName = selectedGenre 
    ? genres?.find(genre => genre.id === selectedGenre)?.name 
    : 'All Genres';

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="relative">
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
      </div>

      {/* Genre Dropdown */}
      <div className="relative" ref={dropdownRef}>
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

      {/* Active Filters Display */}
      {(localQuery || selectedGenre) && (
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
        </div>
      )}
    </div>
  );
};
