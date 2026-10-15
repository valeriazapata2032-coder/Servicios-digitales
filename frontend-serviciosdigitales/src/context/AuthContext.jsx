import { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('innova_user') || 'null')
    } catch {
      return null
    }
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('innova_token')
    if (!token) {
      setLoading(false)
      return
    }
    api
      .me()
      .then((u) => {
        setUser(u)
        localStorage.setItem('innova_user', JSON.stringify(u))
      })
      .catch(() => {
        localStorage.removeItem('innova_token')
        localStorage.removeItem('innova_user')
        setUser(null)
      })
      .finally(() => setLoading(false))
  }, [])

  async function login(correo, password) {
    const data = await api.login({ correo, password })
    localStorage.setItem('innova_token', data.token)
    localStorage.setItem('innova_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  async function registro(payload) {
    const data = await api.registro(payload)
    localStorage.setItem('innova_token', data.token)
    localStorage.setItem('innova_user', JSON.stringify(data.user))
    setUser(data.user)
    return data.user
  }

  function logout() {
    localStorage.removeItem('innova_token')
    localStorage.removeItem('innova_user')
    setUser(null)
  }

  function panelPath() {
    if (!user) return '/login'
    if (user.rol === 'administrador') return '/panel/admin'
    if (user.rol === 'vendedor') return '/panel/vendedor'
    return '/panel/cliente'
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registro, logout, panelPath }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
