import { useEffect } from 'react'

/**
 * Global keyboard shortcuts for the admin dashboard.
 * @param {Object} handlers - { onSearch, onNew, onSave }
 */
export default function useAdminShortcuts({ onSearch, onNew, onSave } = {}) {
  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().includes('MAC')
      const ctrl = isMac ? e.metaKey : e.ctrlKey
      const tag = document.activeElement?.tagName?.toLowerCase()
      const isEditing = ['input', 'textarea', 'select'].includes(tag) ||
        document.activeElement?.contentEditable === 'true'

      // Ctrl+K / Cmd+K — open search (works everywhere)
      if (ctrl && e.key === 'k') {
        e.preventDefault()
        onSearch?.()
        return
      }

      // Skip other shortcuts when typing in a form field
      if (isEditing) {
        // Ctrl+S / Cmd+S — save (works in forms too)
        if (ctrl && e.key === 's') {
          e.preventDefault()
          onSave?.()
        }
        return
      }

      // Ctrl+N / Cmd+N — new item
      if (ctrl && e.key === 'n') {
        e.preventDefault()
        onNew?.()
      }

      // / — focus search on current page
      if (e.key === '/' && !ctrl) {
        const searchInput = document.querySelector('input[placeholder*="Search"]') ||
          document.querySelector('input[type="search"]')
        if (searchInput) {
          e.preventDefault()
          searchInput.focus()
        }
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onSearch, onNew, onSave])
}