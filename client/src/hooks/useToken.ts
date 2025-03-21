export const useToken = () => {
  const getToken = () => localStorage.getItem('auth_token');

  const setToken = (token: string) => {
    localStorage.setItem('auth_token', token);
  };

  const removeToken = () => {
    localStorage.removeItem('auth_token');
  };

  return { getToken, setToken, removeToken };
};
