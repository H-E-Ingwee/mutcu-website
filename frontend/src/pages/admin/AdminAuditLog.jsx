import { useEffect, useState, useCallback } from 'react'
import { adminUsersAPI } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { ScrollText, Search, RefreshCw, Shield, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const ACTION_CONFIG = {
  CREATE:  { label: 'Created',  color: 'bg-green-100 text-green-700',  dot: 'bg-green-500' },
  UPDATE:  { label: 'Updated',  color: 'bg-blue-100 text-blue-700',    dot: 'bg-blue-500' },
  DELETE:  { label: 'Deleted',  color: 'bg-red-100 text-red-700',      dot: 'bg-red-500' },
  LOGIN:   { label: 'Login',    color: 'bg-gray-100 text-gray-600',    dot: 'bg-gray-400' },
  LOGOUT:  { label: 'Logout',   color: 'bg-gray-100 text-gray-500',    dot: 'bg-gray-300' },
  EXPORT:  { label: 'Exported', color: 'bg-purple-100 text-purple-700',dot: 'bg-purple-500' },
  INVITE:  { label: 'Invited',  color: 'bg-orange/10 text-orange',     dot: 'bg-orange' },
}

const MODULE_ICONS = {
  blogs: 'fa-file-text', events: 'fa-calendar', gallery: 'fa-images',
  prayer: 'fa-praying-hands', contacts: 'fa-envelope', leadership: 'fa-users',
  ministries: 'fa-church', resources: 'fa-book', settings: 'fa-cog',
  expo: 'fa-briefcase', forms: 'fa-clipboard-list', users: 'fa-user-shield',
  newsletter: 'fa-newspaper', homepage: 'fa-home',
}

export default function AdminAuditLog() {
  const { isSuperAdmin } = useAuth()
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [moduleFilter, setModuleFilter] = useState('')
  const [actionFilter, setActionFilter] = useState('')
  const [selected, setSelected] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const params = {}
      if (moduleFilter) params.module = moduleFilter
      if (actionFilter) params.action = actionFilter
      if (search.trim()) params.search = search.trim()
      const data = await adminUsersAPI.getAuditLog(params)
      setLogs(data.logs || [])
    } catch (err) {
      toast.error('Failed to load audit log')
    } finally {
      setLoading(false)
    }
  }, [moduleFilter, actionFilter, search])

  useEffect(() => { load() }, [load])

  if (!isSuperAdmin()) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <Shield size={48} className="text-gray-200 mb-4" />
        <h2 className="font-montserrat font-black text-navy text-xl mb-2">Super Admin Only</h2>
        <p className="text-gray-400 text-sm">Only super admins can view the audit log.</p>
      </div>
    )
  }

  const exportCSV = () => {
    const rows = [
      ['Time', 'User', 'Email', 'Role', 'Action', 'Module', 'Record', 'IP'],
      ...logs.map(l => [
        l.created_at ? new Date(l.created_at).toLocaleString('en-GB') : '',
        l.user_name || '',
        l.user_email || '',
        l.user_role || '',
        l.action || '',
        l.module || '',
        l.record_title || l.record_id || '',
        l.ip_address || '',
      ])
    ]
    const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `mutcu-audit-log-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
    toast.success('Audit log exported!')
  }

  const formatTime = (t) => {
    if (!t) return ''
    const d = new Date(t)
    const now = new Date()
    const diff = Math.floor((now - d) / 60000)
    if (diff < 1) return 'just now'
    if (diff < 60) return `${diff}m ago`
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`
    return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  const modules = [...new Set(logs.map(l => l.module).filter(Boolean))]
  const actions = Object.keys(ACTION_CONFIG)

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-montserrat font-black text-navy text-xl">Audit Log</h1>
          <p className="text-gray-400 text-sm mt-0.5">Complete record of all admin actions — who did what, when</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} disabled={loading} className="btn-outline btn-sm">
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
          <button onClick={exportCSV} disabled={logs.length === 0} className="btn-outline btn-sm">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by user, email, or record..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm font-lato focus:outline-none focus:border-orange transition-colors" />
        </div>
        <select value={moduleFilter} onChange={e => setModuleFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors">
          <option value="">All Modules</option>
          {modules.map(m => <option key={m} value={m} className="capitalize">{m}</option>)}
        </select>
        <select value={actionFilter} onChange={e => setActionFilter(e.target.value)}
          className="px-3 py-2 rounded-xl border border-gray-200 text-xs font-montserrat font-semibold text-gray-600 focus:outline-none focus:border-orange transition-colors">
          <option value="">All Actions</option>
          {actions.map(a => <option key={a} value={a}>{ACTION_CONFIG[a]?.label || a}</option>)}
        </select>
      </div>

      {/* Log table */}
      {loading ? (
        <div className="flex items-center justify-center py-16"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange" /></div>
      ) : logs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 text-gray-400">
          <ScrollText size={40} className="mx-auto mb-3 opacity-30" />
          <p className="font-montserrat font-semibold text-sm">
            {search || moduleFilter || actionFilter ? 'No logs match your filters' : 'No audit log entries yet'}
          </p>
          <p className="text-xs mt-1">Actions will appear here as admins use the dashboard</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Action</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden sm:table-cell">User</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Module</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider hidden lg:table-cell">Record</th>
                  <th className="text-left px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Time</th>
                  <th className="text-right px-4 py-3 text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => {
                  const ac = ACTION_CONFIG[log.action] || { label: log.action, color: 'bg-gray-100 text-gray-600', dot: 'bg-gray-400' }
                  const moduleIcon = MODULE_ICONS[log.module] || 'fa-circle'
                  return (
                    <tr key={log.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-gray-50/20'}`}
                      onClick={() => setSelected(log)}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${ac.dot}`} />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-montserrat font-bold ${ac.color}`}>{ac.label}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <div className="font-montserrat font-semibold text-navy text-xs">{log.user_name || '—'}</div>
                        <div className="text-gray-400 text-xs">{log.user_role?.replace(/_/g, ' ')}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        {log.module && (
                          <div className="flex items-center gap-1.5">
                            <i className={`fas ${moduleIcon} text-orange text-xs`} />
                            <span className="text-gray-600 text-xs font-montserrat font-semibold capitalize">{log.module}</span>
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <div className="text-gray-600 text-xs truncate max-w-[180px]">{log.record_title || log.record_id || '—'}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-gray-400 text-xs font-montserrat whitespace-nowrap">{formatTime(log.created_at)}</div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        {log.details && (
                          <button onClick={e => { e.stopPropagation(); setSelected(log) }}
                            className="text-xs text-orange hover:underline font-montserrat font-semibold">
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="px-4 py-3 border-t border-gray-50 text-xs text-gray-400 font-montserrat">
            {logs.length} log entr{logs.length !== 1 ? 'ies' : 'y'}
            {(search || moduleFilter || actionFilter) && ' (filtered)'}
          </div>
        </div>
      )}

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setSelected(null)}>
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h3 className="font-montserrat font-black text-navy text-base">Log Entry Details</h3>
              <button onClick={() => setSelected(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 transition-all">✕</button>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Action', value: selected.action },
                { label: 'Module', value: selected.module },
                { label: 'Record', value: selected.record_title || selected.record_id },
                { label: 'User', value: selected.user_name },
                { label: 'Email', value: selected.user_email },
                { label: 'Role', value: selected.user_role?.replace(/_/g, ' ') },
                { label: 'IP Address', value: selected.ip_address },
                { label: 'Time', value: selected.created_at ? new Date(selected.created_at).toLocaleString('en-GB') : null },
              ].filter(f => f.value).map((f, i) => (
                <div key={i}>
                  <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-0.5">{f.label}</p>
                  <p className="text-navy text-sm font-lato">{f.value}</p>
                </div>
              ))}
              {selected.details && (
                <div>
                  <p className="text-xs font-montserrat font-bold text-gray-400 uppercase tracking-wider mb-1">Details</p>
                  <pre className="bg-gray-50 rounded-xl p-3 text-xs text-gray-600 overflow-x-auto font-lato">
                    {JSON.stringify(selected.details, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}