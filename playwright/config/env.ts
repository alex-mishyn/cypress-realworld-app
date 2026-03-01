export const ENV = {
  apiUrl: `http://localhost:${process.env.VITE_BACKEND_PORT ?? 3002}`,
  defaultPassword: process.env.SEED_DEFAULT_USER_PASSWORD ?? 's3cret',
  baseUrl: `http://localhost:${process.env.PORT ?? 3000}`,
  BACKEND_GRAPHQL_URL: `http://localhost:${process.env.VITE_BACKEND_PORT ?? 3002}/graphql`,
} as const;