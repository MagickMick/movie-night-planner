// Configuration for the frontend application
export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Movie Night Planner',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
  },
} as const;

export default config;
