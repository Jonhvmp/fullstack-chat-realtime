import { setAuthToken } from './auth';

export const extractTokenFromUrl = () => {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  return params.get('token');
};

export const handleTokenFromUrl = () => {
  const token = extractTokenFromUrl();
  if (token) {
    setAuthToken(token);
    // Limpa o token da URL
    window.history.replaceState({}, document.title, window.location.pathname);
    return true;
  }
  return false;
};
