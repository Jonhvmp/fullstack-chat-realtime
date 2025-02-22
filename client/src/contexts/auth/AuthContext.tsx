'use client'

import { createContext, useContext, useState, ReactNode } from 'react'
import axios from 'axios'
import { IUser, AuthContextType } from './types'
const AuthContext = createContext<AuthContextType>({} as AuthContextType)

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null)

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )
      setUser(response.data.user)
    } catch (error: unknown) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/api/auth/logout`, {}, { withCredentials: true })
      setUser(null)
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      loginWithGithub: () => Promise.resolve(),
      isAuthenticated: !!user,
      isLoading: false,
      error: null
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
