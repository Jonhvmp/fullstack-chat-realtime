'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export function withAuth(Component: React.ComponentType) {
  return function AuthenticatedComponent(props: any) {
    const router = useRouter()

    useEffect(() => {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        router.push('/')
        return
      }

      // Injeta o token em todos os requests
      const originalFetch = window.fetch
      window.fetch = function (input: RequestInfo | URL, init?: RequestInit) {
        if (init) {
          init.headers = {
            ...init.headers,
            'x-auth-token': token,
            'Authorization': `Bearer ${token}`
          }
        }
        return originalFetch(input, init)
      }

      return () => {
        window.fetch = originalFetch
      }
    }, [router])

    return <Component {...props} />
  }
}
