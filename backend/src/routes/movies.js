const express = require('express');
const { TmdbService } = require('../services/tmdb/tmbd-service');

const router = express.Router();

// GET /api/movies/popular - Get popular movies
router.get('/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    
    if (limit > 20) {
      return res.status(400).json({
        error: 'Limit cannot exceed 20 movies per request'
      });
    }

    console.log(`🎬 Fetching ${limit} popular movies...`);
    const result = await TmdbService.getPopularMovies(limit);
    
    res.json({
      success: true,
      data: result,
      message: `Retrieved ${result.movies.length} popular movies`
    });
  } catch (error) {
    console.error('❌ Error in /api/movies/popular:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch popular movies',
      message: error.message
    });
  }
});

// GET /api/movies/search - Search movies
router.get('/search', async (req, res) => {
  try {
    const { q: query, limit = 10 } = req.query;
    
    if (!query) {
      return res.status(400).json({
        success: false,
        error: 'Query parameter "q" is required'
      });
    }

    if (parseInt(limit) > 20) {
      return res.status(400).json({
        error: 'Limit cannot exceed 20 movies per request'
      });
    }

    console.log(`🔍 Searching movies for: "${query}" (limit: ${limit})`);
    const result = await TmdbService.searchMovies(query, parseInt(limit));
    
    res.json({
      success: true,
      data: result,
      message: `Found ${result.movies.length} movies for "${query}"`
    });
  } catch (error) {
    console.error('❌ Error in /api/movies/search:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to search movies',
      message: error.message
    });
  }
});

// GET /api/movies/genres - Get available genres
router.get('/genres', async (req, res) => {
  try {
    console.log('🎭 Fetching movie genres...');
    const genres = await TmdbService.getGenres();
    
    res.json({
      success: true,
      data: { genres },
      message: `Retrieved ${genres.length} genres`
    });
  } catch (error) {
    console.error('❌ Error in /api/movies/genres:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch genres',
      message: error.message
    });
  }
});

module.exports = router;
