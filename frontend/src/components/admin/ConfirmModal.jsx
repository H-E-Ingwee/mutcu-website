import { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

/**
 * Branded confirmation modal — replaces window.confirm() across all admin pages.
 *
 * Usage:
 *   const [confirm, setConfirm] = useState(null)
 *   // trigger:
 *   setConfirm({ title: 'Delete Event?', message: 'This cannot be undone.', onConfirm: () => handleDelete(id) })
 *   // render:
 *   <ConfirmModal config={confirm} onClose={() => setConfirm(null)} />
 */
export default function ConfirmModal({ config, onClose }) {
  // Close on Escape key
  useEffect(() => {
    if (!config) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [config, onClose])

  if (!config) return null

  const {
    title = 'Are you sure?',
    message = 'This action cannot be undone.',
    confirmLabel = 'Delete',
    cancelLabel = 'Cancel',
    variant = 'danger', // danger | warning | info
    onConfirm,
  } = config

  const variantStyles = {
    danger:  { icon: Trash2,         iconBg: 'bg-red-100',    iconColor: 'text-red-600',    btn: 'bg-red-600 hover:bg-red-700 text-white' },
    warning: { icon: AlertTriangle,  iconBg: 'bg-yellow-100', iconColor: 'text-yellow-600', btn: 'bg-yellow-500 hover:bg-yellow-600 text-white' },
    info:    { icon: AlertTriangle,  iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   btn: 'bg-blue-600 hover:bg-blue-700 text-white' },
  }

  const style = variantStyles[variant] || variantStyles.danger
  const Icon = style.icon

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-[200] bg-black/50 flex items-center justify-center p-4"
      onClick={onClose}>
      <div
        className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-start justify-between p-5 pb-0">
          <div className={`w-11 h-11 rounded-2xl ${style.iconBg} flex items-center justify-center flex-shrink-0`}>
            <Icon size={20} className={style.iconColor} />
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all">
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 pt-4 pb-6">
          <h3 className="font-montserrat font-black text-navy text-base mb-1.5">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed">{message}</p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 px-5 pb-5">
          <button
            onClick={handleConfirm}
            className={`flex-1 py-2.5 rounded-xl font-montserrat font-bold text-sm transition-all hover:-translate-y-0.5 ${style.btn}`}>
            {confirmLabel}
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl font-montserrat font-bold text-sm bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all">
            {cancelLabel}
          </button>
        </div>
      </div>
    </div>
  )
}