'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { handleTokenFromUrl } from '../utils/token'
import { useAuth } from '@/contexts/auth/AuthContext'

export default function Home() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    const hasToken = handleTokenFromUrl()

    if (hasToken || isAuthenticated) {
      router.push('/chat')
    } else {
      router.push('/login')
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        Redirecionando...
      </div>
    </div>
  )
}
