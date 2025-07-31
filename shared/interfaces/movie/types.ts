// Base Movie interface from TMDB API
export interface IMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number | null;
  vote_count: number | null;
  genre_ids: number[];
  adult: boolean;
  original_language: string;
  popularity: number;
}

// Popular Movies Response interface
export interface IPopularMovies {
  movies: IMovie[];
  total_results: number;
  total_pages: number;
  page: number;
}

// Search Movies Response interface
export interface ISearchMoviesResponse {
  movies: IMovie[];
  total_results: number;
  total_pages: number;
  page: number;
  query: string;
}

// Genre interface
export interface IGenre {
  id: number;
  name: string;
}

// Genres Response interface
export interface IGenresResponse {
  genres: IGenre[];
}

// API Response wrapper
export interface IApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  error?: string;
}