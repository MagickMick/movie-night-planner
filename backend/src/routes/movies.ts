import express, { Request, Response } from 'express';
import { TmdbService } from '../services/tmdb/tmbd-service';

const router = express.Router();

// GET /api/movies/popular - Get popular movies
router.get('/popular', async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;
    const page = parseInt(req.query.page as string) || 1;
    
    if (limit > 20) {
      return res.status(400).json({
        error: 'Limit cannot exceed 20 movies per request'
      });
    }

    if (page < 1) {
      return res.status(400).json({
        error: 'Page must be a positive number'
      });
    }

    console.log(`🎬 Fetching ${limit} popular movies for page ${page}...`);
    const result = await TmdbService.getPopularMovies(limit, page);
    
    res.json({
      success: true,
      data: result,
      message: `Retrieved ${result.movies.length} popular movies`
    });
  } catch (error) {
    console.error('❌ Error in /api/movies/popular:', error instanceof Error ? error.message : error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular movies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/movies/search - Search movies
router.get('/search', async (req: Request, res: Response) => {
  try {
    const { q: query, limit = '10', page = '1' } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required and must be a string'
      });
    }

    const parsedLimit = parseInt(limit as string);
    const parsedPage = parseInt(page as string);
    
    if (parsedLimit > 20) {
      return res.status(400).json({
        error: 'Limit cannot exceed 20 movies per request'
      });
    }

    if (parsedPage < 1) {
      return res.status(400).json({
        error: 'Page must be a positive number'
      });
    }

    console.log(`🔍 Searching movies for: "${query}" (limit: ${parsedLimit}, page: ${parsedPage})`);
    const result = await TmdbService.searchMovies(query, parsedLimit, parsedPage);
    
    res.json({
      success: true,
      data: result,
      message: `Found ${result.movies.length} movies for "${query}"`
    });
  } catch (error) {
    console.error('❌ Error in /api/movies/search:', error instanceof Error ? error.message : error);
    res.status(500).json({
      success: false,
      error: 'Failed to search movies',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/movies/genres - Get available genres
router.get('/genres', async (req: Request, res: Response) => {
  try {
    console.log('🎭 Fetching movie genres...');
    const genres = await TmdbService.getGenres();
    
    res.json({
      success: true,
      data: { genres },
      message: `Retrieved ${genres.length} genres`
    });
  } catch (error) {
    console.error('❌ Error in /api/movies/genres:', error instanceof Error ? error.message : error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch genres',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;
