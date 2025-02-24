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
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/validate-token`, {
          withCredentials: true
        })
        setUser(response.data.user)
      } catch (error) {
        // Se for erro 401, apenas limpa o usuário silenciosamente
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          setUser(null);
        } else {
          console.error('Erro ao verificar autenticação:', error)
          setUser(null)
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string, token2FA?: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password, token2FA },
        { withCredentials: true }
      );

      if (response.status === 206) {
        return { require2FA: true };
      }

      setUser(response.data.user);
      return { success: true, user: response.data.user };

    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 206) {
        return { require2FA: true };
      }
      throw error;
    }
  };

  const SignInOrSignUpWithGithub = async () => {
    window.location.href = `${API_URL}/api/auth/github`;
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true })
      setUser(null)

      setTimeout(() => {
        router.push('/')
      }, 500)
    } catch (error) {
      console.error(error)
    }
  }

  const updateUser = async (userData: { name?: string; email?: string }) => {
    try {
      const response = await api.patch('/user/update', userData);
      setUser(response.data.user);
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      SignInOrSignUpWithGithub,
      isAuthenticated: !!user,
      isLoading: loading,
      error: null,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
