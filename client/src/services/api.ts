import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_SERVER_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Verifica se ainda existe token no localStorage
      const localToken = localStorage.getItem('auth_token');
      if (!localToken) {
        // Só limpa tudo e redireciona se não houver token no localStorage
        localStorage.removeItem('auth_token');
        document.cookie = 'auth_token=; path=/;';
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
