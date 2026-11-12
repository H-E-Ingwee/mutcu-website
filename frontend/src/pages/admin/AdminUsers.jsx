import { useEffect, useState, useCallback } from 'react'
import { adminUsersAPI } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { ROLE_PERMISSIONS } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import {
  Plus, Edit2, Trash2, X, Check, RefreshCw, Mail,
  Shield, UserCheck, UserX, Send, Clock, CheckCircle,
  AlertCircle, Users, Copy
} from 'lucide-react'
import ConfirmModal from '../../components/admin/ConfirmModal'

const ROLE_OPTIONS = [
  { value: 'super_admin',        label: 'Super Admin',              desc: 'Full access to everything', color: 'text-orange' },
  { value: 'secretary',          label: 'CU Secretary',             desc: 'Contacts, Prayer, Newsletter, Leadership, Settings, Forms, Content', color: 'text-blue-500' },
  { value: 'content_manager',    label: 'Content & Events Manager', desc: 'Homepage, Events, Leadership, Ministries, Resources, Blogs, Gallery, Forms', color: 'text-green-600' },
  { value: 'blog_manager',       label: 'Blog & Editorial Manager', desc: 'Blogs, Gallery, Forms', color: 'text-purple-600' },
  { value: 'gallery_manager',    label: 'Gallery & Media Manager',  desc: 'Gallery, Forms', color: 'text-teal' },
  { value: 'newsletter_manager', label: 'Newsletter Manager',       desc: 'Newsletter, Analytics, Forms', color: 'text-yellow-600' },
  { value: 'prayer_manager',     label: 'Prayer & Contact Manager', desc: 'Prayer, Contacts, Forms', color: 'text-red-600' },
  { value: 'analytics_manager',  label: 'SEO & Analytics Manager',  desc: 'Analytics, Settings, Forms', color: 'text-indigo-600' },
  { value: 'expo_manager',       label: 'Expo Manager',             desc: 'Expo Registrations, Expo Settings, Forms, Analytics', color: 'text-orange' },
]

const ROLE_COLORS = {
  super_admin:        'bg-orange/10 text-orange border-orange/20',
  secretary:          'bg-blue-50 text-blue-700 border-blue-200',
  content_manager:    'bg-green-50 text-green-700 border-green-200',
  blog_manager:       'bg-purple-50 text-purple-700 border-purple-200',
  gallery_manager:    'bg-teal/10 text-teal border-teal/20',
  newsletter_manager: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  prayer_manager:     'bg-red-50 text-red-700 border-red-200',
  analytics_manager:  'bg-indigo-50 text-indigo-700 border-indigo-200',
  expo_manager:       'bg-orange/10 text-orange border-orange/20',
}

function RoleBadge({ role }) {
  const colors = ROLE_COLORS[role] || 'bg-gray-100 text-gray-600 border-gray-200'
  const label = ROLE_OPTIONS.find(r => r.value === role)?.label || role
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-montserrat font-bold border ${colors}`}>
      {label}
    </span>
  )
}

function StatusBadge({ user }) {
  if (!user.is_active) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold bg-red-50 text-red-600 border border-red-200">
      <UserX size={10} />Deactivated
    </span>
  )
  if (!user.invite_accepted) return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold bg-yellow-50 text-yellow-700 border border-yellow-200">
      <Clock size={10} />Pending Invite
    </span>
  )
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-montserrat font-bold bg-green-50 text-green-700 border border-green-200">
      <CheckCircle size={10} />Active
    </span>
  )
}

export default function AdminUsers() {
  const { user: currentUser, isSuperAdmin } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [inviteModal, setInviteModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [confirm, setConfirm] = useState(null)
  const [inviteForm, setInviteForm] = useState({ email: '', name: '', website_role: 'content_manager' })
  const [editForm, setEditForm] = useState({ website_role: '', is_active: true, name: '' })
  const [saving, setSaving] = useState(false)
  const [resending, setResending] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await adminUsersAPI.getAll()
      setUsers(data.users || [])
    } catch (err) {
      toast.error('Failed to load admin users')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  if (!isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Shield size={48} className="text-gray-200 mb-4" />
        <h2 className="font-montserrat font-black text-navy text-xl mb-2">Super Admin Only</h2>
        <p className="text-gray-400 text-sm">Only super admins can manage website admin users.</p>
      </div>
    )
  }

  const handleInvite = async (e) => {
    e.preventDefault()
    if (!inviteForm.email.trim() || !inviteForm.name.trim()) return toast.error('Email and name are required')
    setSaving(true)
    try {
      await adminUsersAPI.invite(inviteForm)
      toast.success(`Invitation sent to ${inviteForm.email}!`)
      setInviteModal(false)
      setInviteForm({ email: '', name: '', website_role: 'content_manager' })
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to send invitation')
    } finally {
      setSaving(false) }
  }

  const handleEdit = async () => {
    setSaving(true)
    try {
      await adminUsersAPI.update(editModal.id, editForm)
      toast.success('User updated!')
      setEditModal(null)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to update user')
    } finally {
      setSaving(false)
    }
  }

  const handleResendInvite = async (userId, email) => {
    setResending(userId)
    try {
      await adminUsersAPI.resendInvite(userId)
      toast.success(`Invitation resent to ${email}`)
    } catch (err) {
      toast.error(err.message || 'Failed to resend invitation')
    } finally {
      setResending(null)
    }
  }

  const handleDeactivate = (user) => {
    setConfirm({
      title: `Deactivate ${user.name}?`,
      message: `${user.name} will lose access to the admin dashboard immediately. You can reactivate them later.`,
      confirmLabel: 'Deactivate',
      variant: 'warning',
      onConfirm: async () => {
        try {
          await adminUsersAPI.deactivate(user.id)
          toast.success(`${user.name} has been deactivated`)
          load()
        } catch (err) {
          toast.error(err.message || 'Failed to deactivate user')
        }
      }
    })
  }

  const handleReactivate = async (user) => {
    try {
      await adminUsersAPI.update(user.id, { is_active: true })
      toast.success(`${user.name} reactivated!`)
      load()
    } catch (err) {
      toast.error(err.message || 'Failed to reactivate')
    }
  }

  const copyInviteLink = (token) => {
    if (!token) return toast.error('No pending invite token')
    const url = `${window.location.origin}/admin/accept-invite?token=${token}`
    navigator.clipboard.writeText(url).then(() => toast.success('Invite link copied!')).catch(() => toast.error('Could not copy'))
  }

  const activeUsers = users.filter(u => u.is_active && u.invite_accepted).length
  const pendingUsers = users.filter(u => u.is_active && !u.invite_accepted).length
  const deactivatedUsers = users.filter(u => !u.is_active).length

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Admin Users</h1>
          <div className="flex items-center gap-3 mt-1">
            <span className="text-xs text-green-600 font-semibold">{activeUsers} active</span>
            <span className="text-xs text-yellow-600 font-semibold">{pendingUsers} pending</span>
            {deactivatedUsers > 0 && <span className="text-xs text-red-500 font-semibold">{deactivatedUsers} deactivated</span>}
          </div>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn-outline btn-sm">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={() => setInviteModal(true)} className="btn-primary btn-sm">
            <Plus size={14} /> Invite User
          </button>
        </div>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-5 text-xs text-blue-700 flex items-start gap-2">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <span>
          Website admin users are <strong>separate from the DMS portal</strong>. DMS super_admin and ec_admin accounts always have full access.
          Use this page to invite non-technical team members (Content Manager, Gallery Manager, etc.) with scoped access.
        </span>
      </div>

      {/* Users table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : users.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Users size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="font-montserrat font-semibold text-gray-400 text-sm mb-1">No website admin users yet</p>
          <p className="text-gray-300 text-xs mb-4">Invite team members to manage the website</p>
          <button onClick={() => setInviteModal(true)} className="btn-primary btn-sm">
            <Plus size={14} /> Invite First User
          </button>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">User</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">Role</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Status</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Last Login</th>
                  <th className="text-right px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, i) => (
                  <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${!u.is_active ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-orange flex items-center justify-center text-white font-montserrat font-black text-sm flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <div className="font-montserrat font-bold text-navy text-sm truncate">
                            {u.name}
                            {u.email === currentUser?.email && <span className="ml-1 text-xs text-orange font-normal">(you)</span>}
                          </div>
                          <div className="text-gray-400 text-xs truncate">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <RoleBadge role={u.website_role} />
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <StatusBadge user={u} />
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-gray-400 text-xs">
                      {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Never'}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        {/* Resend invite for pending users */}
                        {u.is_active && !u.invite_accepted && (
                          <button
                            onClick={() => handleResendInvite(u.id, u.email)}
                            disabled={resending === u.id}
                            className="p-1.5 rounded-lg hover:bg-yellow-50 text-gray-400 hover:text-yellow-600 transition-colors"
                            title="Resend invitation">
                            {resending === u.id ? <RefreshCw size={13} className="animate-spin" /> : <Send size={13} />}
                          </button>
                        )}
                        {/* Edit */}
                        <button
                          onClick={() => { setEditModal(u); setEditForm({ website_role: u.website_role, is_active: u.is_active, name: u.name }) }}
                          className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors"
                          title="Edit user">
                          <Edit2 size={13} />
                        </button>
                        {/* Deactivate / Reactivate */}
                        {u.email !== currentUser?.email && (
                          u.is_active ? (
                            <button onClick={() => handleDeactivate(u)}
                              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
                              title="Deactivate user">
                              <UserX size={13} />
                            </button>
                          ) : (
                            <button onClick={() => handleReactivate(u)}
                              className="p-1.5 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600 transition-colors"
                              title="Reactivate user">
                              <UserCheck size={13} />
                            </button>
                          )
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 font-montserrat">
            {users.length} website admin user{users.length !== 1 ? 's' : ''} · DMS super_admin and ec_admin accounts always have full access
          </div>
        </div>
      )}

      {/* Role permissions reference */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 p-5">
        <h3 className="font-montserrat font-bold text-navy text-sm mb-4 flex items-center gap-2">
          <Shield size={14} className="text-orange" /> Role Permissions Reference
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ROLE_OPTIONS.map(role => (
            <div key={role.value} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
              <div className={`font-montserrat font-bold text-sm mb-0.5 ${role.color}`}>{role.label}</div>
              <div className="text-gray-400 text-xs leading-relaxed">{role.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Invite Modal */}
      {inviteModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setInviteModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h3 className="font-montserrat font-black text-navy text-base">Invite Admin User</h3>
                <p className="text-gray-400 text-xs mt-0.5">They'll receive an email to set their password</p>
              </div>
              <button onClick={() => setInviteModal(false)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <form onSubmit={handleInvite} className="p-5 space-y-4">
              <div>
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={inviteForm.name} onChange={e => setInviteForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Grace Wanjiku" required />
              </div>
              <div>
                <label className="form-label">Email Address *</label>
                <input type="email" className="form-input" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="grace@mutcu.org" required />
              </div>
              <div>
                <label className="form-label">Role *</label>
                <select className="form-select" value={inviteForm.website_role} onChange={e => setInviteForm(f => ({ ...f, website_role: e.target.value }))}>
                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {inviteForm.website_role && (
                  <p className="text-gray-400 text-xs mt-1">
                    Access: {ROLE_OPTIONS.find(r => r.value === inviteForm.website_role)?.desc}
                  </p>
                )}
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="btn-primary flex-1 justify-center">
                  {saving ? <><RefreshCw size={13} className="animate-spin" />Sending...</> : <><Mail size={13} />Send Invitation</>}
                </button>
                <button type="button" onClick={() => setInviteModal(false)} className="btn-outline flex-1 justify-center">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setEditModal(null)}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-montserrat font-black text-navy text-base">Edit {editModal.name}</h3>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all"><X size={16} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="form-label">Name</label>
                <input className="form-input" value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="form-label">Role</label>
                <select className="form-select" value={editForm.website_role} onChange={e => setEditForm(f => ({ ...f, website_role: e.target.value }))}>
                  {ROLE_OPTIONS.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                </select>
                {editForm.website_role && (
                  <p className="text-gray-400 text-xs mt-1">
                    Access: {ROLE_OPTIONS.find(r => r.value === editForm.website_role)?.desc}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={editForm.is_active} onChange={e => setEditForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-orange" />
                  <span className="text-sm font-montserrat font-semibold text-navy">Account Active</span>
                </label>
              </div>
            </div>
            <div className="flex gap-3 p-5 border-t border-gray-100">
              <button onClick={handleEdit} disabled={saving} className="btn-primary flex-1 justify-center">
                <Check size={15} />{saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button onClick={() => setEditModal(null)} className="btn-outline flex-1 justify-center">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ConfirmModal config={confirm} onClose={() => setConfirm(null)} />
    </div>
  )
}