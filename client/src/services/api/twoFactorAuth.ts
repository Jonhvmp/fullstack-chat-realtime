import axios from 'axios';
import { useToken } from '@/hooks/useToken';

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

const createApi = () => {
  const { getToken } = useToken();
  const token = getToken();

  return axios.create({
    baseURL: BaseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
  });
};

export const twoFactorAuthService = {
  generateSecret: async () => {
    const api = createApi();
    const response = await api.post('/api/auth/enable-2fa');
    return response.data;
  },

  verifyToken: async (token: string) => {
    const api = createApi();
    const response = await api.post('/api/auth/verify-2fa', { token });
    return response.data;
  },

  disable2FA: async (token: string) => {
    try {
      const api = createApi();
      const response = await api.post('/api/auth/disable-2fa', { token });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Erro ao desativar 2FA');
      }
      throw error;
    }
  }
};

