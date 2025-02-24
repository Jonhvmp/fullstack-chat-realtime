'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { IUser, AuthContextType } from './types'
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
        console.error('Erro ao verificar autenticação:', error)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      setUser(response.data.user)
    } catch (error: unknown) {
      throw error
    }
  }

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

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      SignInOrSignUpWithGithub,
      isAuthenticated: !!user,
      isLoading: loading,
      error: null
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
