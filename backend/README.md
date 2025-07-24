# Movie Night Planner - Backend API

Een Node.js Express API voor de Movie Night Planner applicatie.

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 of hoger)
- npm of yarn

### Installation

1. Navigeer naar de backend folder:
```bash
cd backend
```

2. Installeer dependencies:
```bash
npm install
```

3. Kopieer environment variables:
```bash
cp .env.example .env
```

4. Start de development server:
```bash
npm run dev
```

De server draait nu op `http://localhost:3000`

## 📋 Available Scripts

- `npm start` - Start productie server
- `npm run dev` - Start development server met nodemon (auto-reload)
- `npm test` - Run tests (nog niet geïmplementeerd)

## 🛠 API Endpoints

### Base URL: `http://localhost:3000`

- `GET /` - API status en versie informatie
- `GET /health` - Health check endpoint
- `GET /api/movies` - Movies endpoint (placeholder)

## 🏗 Project Structure

```
backend/
├── server.js          # Main server file
├── package.json       # Dependencies en scripts
├── .env               # Environment variables (niet in git)
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
└── README.md          # Deze documentatie
```

## 🔧 Environment Variables

Zie `.env.example` voor alle beschikbare environment variables.

## 📦 Dependencies

- **express** - Web framework
- **cors** - Cross-Origin Resource Sharing
- **dotenv** - Environment variables laden
- **nodemon** - Development server auto-reload

## 🎬 Toekomstige Features

- Database integratie
- Authentication/Authorization
- Movie API integratie (TMDB)
- User management
- Movie night planning endpoints
