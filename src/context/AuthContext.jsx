import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const AuthContext = createContext(null)

const API_BASE = '' // Set to your backend URL if needed, e.g. 'http://localhost:8000'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = sessionStorage.getItem('auth_user')
      return stored ? JSON.parse(stored) : null
    } catch { return null }
  })
  const [csrfToken, setCsrfToken] = useState(() => sessionStorage.getItem('csrf_token') || null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const login = useCallback(async (username, password) => {
    setLoading(true)
    setError(null)
    try {
      const body = new URLSearchParams({ username, password })
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: body.toString(),
      })
      if (!res.ok) throw new Error('Invalid credentials')
      const data = await res.json()
      const token = data.CSRFToken
      const userData = {
        name: data.name || username,
        lastAccessTime: data.lastAccessTime || Date.now(),
      }
      setCsrfToken(token)
      setUser(userData)
      sessionStorage.setItem('csrf_token', token)
      sessionStorage.setItem('auth_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      setError(err.message)
      return { success: false, error: err.message }
    } finally {
      setLoading(false)
    }
  }, [])

  const logout = useCallback(async () => {
    if (!csrfToken) {
      setUser(null)
      return
    }
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'DELETE',
        headers: {
          'X-CSRFTOKEN': csrfToken,
          'Content-Type': 'application/json',
        },
      })
    } catch { /* best effort */ } finally {
      setUser(null)
      setCsrfToken(null)
      sessionStorage.removeItem('csrf_token')
      sessionStorage.removeItem('auth_user')
    }
  }, [csrfToken])

  return (
    <AuthContext.Provider value={{ user, csrfToken, loading, error, setError, login, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
