import { CorsOptions } from 'cors';

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  process.env.CLIENT_URL,
  process.env.PRODUCTION_URL,
].filter((origin): origin is string => Boolean(origin));

export const CORS_CONFIG: CorsOptions = {
  origin: process.env.NODE_ENV === 'production'
    ? allowedOrigins
    : true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Authorization'],
  optionsSuccessStatus: 200
};
