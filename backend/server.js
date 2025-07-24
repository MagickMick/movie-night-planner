const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const moviesRoutes = require('./src/routes/movies');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: 'Movie Night Planner API is running!',
    version: '1.0.0'
  });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// API routes
app.use('/api/movies', moviesRoutes);

// Legacy API route (for backwards compatibility)
app.get('/api/movies', (req, res) => {
  res.json({ 
    message: 'Use /api/movies/popular or /api/movies/search instead',
    endpoints: {
      popular: '/api/movies/popular?limit=10',
      search: '/api/movies/search?q=batman&limit=10',
      genres: '/api/movies/genres'
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`🎬 Movie Night Planner API started successfully!`);
});
