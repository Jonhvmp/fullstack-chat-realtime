'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { IUser, AuthContextType } from './types'
import api from '@src/services/api'

const AuthContext = createContext<AuthContextType>({} as AuthContextType)
const API_URL = process.env.NEXT_PUBLIC_SERVER_URL

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const validateAuth = async (token?: string) => {
    try {
      const config = {
        withCredentials: true,
        ...(token && {
          headers: { Authorization: `Bearer ${token}` }
        })
      };

      const response = await axios.get(`${API_URL}/api/auth/validate-token`, config);
      return { success: true, user: response.data.user };
    } catch (error) {
      return { success: false, error };
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Primeiro tenta com cookie
        let authResult = await validateAuth();

        // Se falhar, tenta com localStorage
        if (!authResult.success) {
          const storedToken = localStorage.getItem('auth_token');
          if (storedToken) {
            authResult = await validateAuth(storedToken);
          }
        }

        if (authResult.success && authResult.user) {
          setUser(authResult.user);
        } else {
          setUser(null);
          localStorage.removeItem('auth_token');
        }
      } catch (err) {
        console.error('Erro na verificação de autenticação:', err);
        setUser(null);
        setError('Erro ao verificar autenticação');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string, token2FA?: string) => {
    setError(null);
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password, token2FA },
        { withCredentials: true }
      );

      if (response.status === 206) {
        return { require2FA: true };
      }

      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
      }

      setUser(response.data.user);
      return { success: true, user: response.data.user };

    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : 'Erro ao fazer login';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await api.post('/api/auth/logout');
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      // Mesmo com erro, limpa os dados locais
      localStorage.removeItem('auth_token');
      setUser(null);
      router.push('/');
    }
  };

  const updateUser = async (userData: { name?: string; email?: string }) => {
    try {
      const response = await api.patch('/user/update', userData);
      setUser(response.data.user);
      return response.data;
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) && err.response?.data?.message ? err.response.data.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const value = {
    user,
    login,
    logout,
    SignInOrSignUpWithGithub: async () => {
      window.location.href = `${API_URL}/api/auth/github`;
    },
    isAuthenticated: !!user,
    isLoading: loading,
    error,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
