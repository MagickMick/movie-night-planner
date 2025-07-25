import { QueryProvider } from '@/providers/QueryProvider';
import { MovieSearchAndList } from '@/components/MovieSearchAndList';
import '@/globals.css';
import './reset.css';
import './App.css';

function App() {
  return (
    <QueryProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        {/* Header Section */}
        <header className="relative py-16">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20" />
          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              🎬 Movie Night Planner
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto">
              Discover popular movies and plan your perfect movie night experience
            </p>
          </div>
        </header>
        
        {/* Main Content Section */}
        <main className="container mx-auto px-4 pb-16">
          <div className="bg-background rounded-2xl shadow-2xl overflow-hidden">
            <MovieSearchAndList limit={20} />
          </div>
        </main>
      </div>
    </QueryProvider>
  );
}

export default App
