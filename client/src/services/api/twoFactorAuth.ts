import axios from 'axios';

const BaseUrl = process.env.NEXT_PUBLIC_API_URL;

// Criar instância do axios com configurações padrão
const api = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const twoFactorAuthService = {
  generateSecret: async () => {
    const response = await api.post('/api/auth/enable-2fa');
    return response.data;
  },

  verifyToken: async (token: string) => {
    const response = await api.post('/api/auth/verify-2fa', { token });
    return response.data;
  },

  disable2FA: async (token: string) => {
    try {
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

