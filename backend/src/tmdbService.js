class TMDBService {
  constructor() {
    this.baseURL = process.env.TMDB_BASE_URL;
    this.accessToken = process.env.TMDB_ACCESS_TOKEN;
    this.apiKey = process.env.TMDB_API_KEY;
  }

  async fetchFromTMDB(endpoint, params = {}) {
    try {
      const url = new URL(`${this.baseURL}${endpoint}`);
      
      // Add API key to params
      url.searchParams.append('api_key', this.apiKey);
      
      // Add other params
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });

      console.log(`🎬 Fetching from TMDB: ${url.pathname}${url.search}`);

      const response = await fetch(url.toString(), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`TMDB API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('❌ TMDB API Error:', error.message);
      throw error;
    }
  }

  async getPopularMovies(limit = 10) {
    try {
      const data = await this.fetchFromTMDB('/movie/popular', {
        language: 'en-US',
        page: 1
      });

      // Transform and limit the results
      const movies = data.results.slice(0, limit).map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids,
        adult: movie.adult,
        original_language: movie.original_language,
        popularity: movie.popularity
      }));

      return {
        movies,
        total_results: data.total_results,
        total_pages: data.total_pages,
        page: data.page
      };
    } catch (error) {
      console.error('❌ Error fetching popular movies:', error.message);
      throw error;
    }
  }

  async searchMovies(query, limit = 10) {
    try {
      if (!query || query.trim() === '') {
        return { movies: [], total_results: 0 };
      }

      const data = await this.fetchFromTMDB('/search/movie', {
        query: query.trim(),
        language: 'en-US',
        page: 1,
        include_adult: false
      });

      // Transform and limit the results
      const movies = data.results.slice(0, limit).map(movie => ({
        id: movie.id,
        title: movie.title,
        overview: movie.overview,
        poster_path: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
        backdrop_path: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : null,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count,
        genre_ids: movie.genre_ids,
        adult: movie.adult,
        original_language: movie.original_language,
        popularity: movie.popularity
      }));

      return {
        movies,
        total_results: data.total_results,
        total_pages: data.total_pages,
        page: data.page,
        query
      };
    } catch (error) {
      console.error('❌ Error searching movies:', error.message);
      throw error;
    }
  }

  async getGenres() {
    try {
      const data = await this.fetchFromTMDB('/genre/movie/list', {
        language: 'en-US'
      });

      return data.genres;
    } catch (error) {
      console.error('❌ Error fetching genres:', error.message);
      throw error;
    }
  }
}

module.exports = new TMDBService();
