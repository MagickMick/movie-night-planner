// TMDB API Configuration
export interface TMDBConfig {
  baseURL: string;
  accessToken: string;
  apiKey: string;
}

// TMDB API Parameters
export interface TMDBParams {
  [key: string]: string | number | boolean | undefined | null;
}

// Get TMDB configuration from environment variables
export const getTMDBConfig = (): TMDBConfig => {
  const baseURL = process.env.TMDB_BASE_URL;
  const accessToken = process.env.TMDB_ACCESS_TOKEN;
  const apiKey = process.env.TMDB_API_KEY;

  if (!baseURL || !accessToken || !apiKey) {
    throw new Error('Missing TMDB configuration. Please check your environment variables.');
  }

  return {
    baseURL,
    accessToken,
    apiKey
  };
};

// Modulaire fetchFromTMDB functie
export const fetchFromTMDB = async (endpoint: string, params: TMDBParams = {}): Promise<any> => {
  try {
    const config = getTMDBConfig();
    const url = new URL(`${config.baseURL}${endpoint}`);
    
    // Add API key to params
    url.searchParams.append('api_key', config.apiKey);
    
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
        'Authorization': `Bearer ${config.accessToken}`,
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
    console.error('❌ TMDB API Error:', error);
    throw error;
  }
};
