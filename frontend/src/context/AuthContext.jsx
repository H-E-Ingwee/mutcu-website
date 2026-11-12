import { createContext, useContext, useState, useEffect } from 'react'
import { adminAPI, adminUsersAPI, setToken, getToken } from '../lib/api'

const AuthContext = createContext(null)

// ─── Role → Permission Matrix ─────────────────────────────────────────────────
// Defines which admin pages each website role can access
export const ROLE_PERMISSIONS = {
  super_admin: {
    label: 'Super Admin',
    pages: ['*'], // all pages
    canManageUsers: true,
    canViewAuditLog: true,
  },
  secretary: {
    label: 'CU Secretary',
    pages: [
      'dashboard', 'analytics', 'contacts', 'prayer', 'newsletter',
      'leadership', 'settings', 'forms', 'homepage', 'events',
      'blogs', 'gallery', 'resources', 'ministries',
    ],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  content_manager: {
    label: 'Content & Events Manager',
    pages: [
      'dashboard', 'analytics', 'homepage', 'events', 'leadership',
      'ministries', 'resources', 'blogs', 'gallery', 'forms',
    ],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  blog_manager: {
    label: 'Blog & Editorial Manager',
    pages: ['dashboard', 'analytics', 'blogs', 'gallery', 'forms'],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  gallery_manager: {
    label: 'Gallery & Media Manager',
    pages: ['dashboard', 'gallery', 'forms'],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  newsletter_manager: {
    label: 'Newsletter Manager',
    pages: ['dashboard', 'analytics', 'newsletter', 'forms'],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  prayer_manager: {
    label: 'Prayer & Contact Manager',
    pages: ['dashboard', 'prayer', 'contacts', 'forms'],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  analytics_manager: {
    label: 'SEO & Analytics Manager',
    pages: ['dashboard', 'analytics', 'settings', 'forms'],
    canManageUsers: false,
    canViewAuditLog: false,
  },
  expo_manager: {
    label: 'Expo Manager',
    pages: ['dashboard', 'expo-registrations', 'expo-settings', 'forms', 'analytics'],
    canManageUsers: false,
    canViewAuditLog: false,
  },
}

// ─── Helper: get effective website role from user object ──────────────────────
export function getWebsiteRole(user) {
  if (!user) return null
  // DMS super_admin / ec_admin → full super_admin access
  if (['super_admin', 'ec_admin'].includes(user.role)) return 'super_admin'
  // DMS cu_secretary → secretary role
  if (user.role === 'cu_secretary') return 'secretary'
  // Website admin user — use their website_role
  if (user.website_role) return user.website_role
  // Fallback
  return 'content_manager'
}

// ─── Helper: check if a page is accessible for a role ────────────────────────
export function canAccessPage(websiteRole, page) {
  if (!websiteRole) return false
  const perms = ROLE_PERMISSIONS[websiteRole]
  if (!perms) return false
  if (perms.pages.includes('*')) return true
  return perms.pages.includes(page)
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = getToken()
    if (token) {
      // Try website admin /me first, then DMS /me
      adminUsersAPI.me()
        .then(data => setUser({ ...data.user, _source: data.user.source || 'website' }))
        .catch(() => {
          // Fall back to DMS admin
          return adminAPI.me()
            .then(data => setUser({ ...data.user, _source: 'dms' }))
            .catch(() => { setToken(null); setUser(null) })
        })
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    // Try website admin login first
    try {
      const data = await adminUsersAPI.login(email, password)
      setToken(data.token)
      setUser({ ...data.user, _source: 'website' })
      return data
    } catch (websiteErr) {
      // If website login fails, try DMS login
      try {
        const data = await adminAPI.login(email, password)
        setToken(data.token)
        setUser({ ...data.user, _source: 'dms' })
        return data
      } catch (dmsErr) {
        // Throw the more specific error
        throw dmsErr
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
  }

  // Role checks
  const websiteRole = getWebsiteRole(user)
  const isAdmin = () => !!user && !!websiteRole
  const isSuperAdmin = () => websiteRole === 'super_admin'
  const canAccess = (page) => canAccessPage(websiteRole, page)
  const canManageUsers = () => ROLE_PERMISSIONS[websiteRole]?.canManageUsers || false
  const canViewAuditLog = () => ROLE_PERMISSIONS[websiteRole]?.canViewAuditLog || false
  const getRoleLabel = () => ROLE_PERMISSIONS[websiteRole]?.label || websiteRole || 'Admin'

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAdmin,
      isSuperAdmin,
      canAccess,
      canManageUsers,
      canViewAuditLog,
      websiteRole,
      getRoleLabel,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
export default AuthContext