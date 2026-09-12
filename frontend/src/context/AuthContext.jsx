import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI, setToken, getToken } from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      adminAPI.me()
        .then(data => setUser(data.user))
        .catch(() => { setToken(null); setUser(null) })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const data = await adminAPI.login(email, password)
    setToken(data.token)
    setUser(data.user)
    return data
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  const isAdmin = () => ['super_admin', 'ec_admin', 'cu_secretary', 'admin'].includes(user?.role)
  const isSuperAdmin = () => ['super_admin', 'ec_admin'].includes(user?.role)

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, isAdmin, isSuperAdmin }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext