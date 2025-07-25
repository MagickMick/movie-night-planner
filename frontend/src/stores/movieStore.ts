import { atom } from 'jotai';

// Search query atom
export const searchQueryAtom = atom<string>('');

// Selected genre atom (null means no genre filter)
export const selectedGenreAtom = atom<number | null>(null);

// Combined atom for easier access
export const movieFiltersAtom = atom(
  (get) => ({
    searchQuery: get(searchQueryAtom),
    selectedGenre: get(selectedGenreAtom)
  })
);
