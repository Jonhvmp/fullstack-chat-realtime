import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL
});

// Lista de rotas públicas que não precisam de token
const publicRoutes = [
  '/api/auth/login',
  '/api/auth/register',
  '/api/auth/github',
  '/api/auth/validate-token'
];

api.interceptors.request.use((config) => {
  // Verifica se a rota atual é pública
  const isPublicRoute = publicRoutes.some(route =>
    config.url?.includes(route)
  );

  if (!isPublicRoute) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/';
      return Promise.reject('No token found');
    }
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default api;
