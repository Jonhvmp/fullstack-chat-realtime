'use client'

import { useEffect } from 'react'

export function TokenInjector() {
  useEffect(() => {
    const token = localStorage.getItem('auth_token')
    if (token) {
      const originalFetch = window.fetch
      window.fetch = function (input, init = {}) {
        return originalFetch(input, {
          ...init,
          headers: {
            ...init.headers,
            Authorization: `Bearer ${token}`,
          },
        })
      }
    }
  }, [])

  return null
}
