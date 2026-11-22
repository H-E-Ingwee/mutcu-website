import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, eventsAPI, blogsAPI, leadershipAPI, newsletterAPI } from '../../lib/api'
import { CheckCircle, Circle, X, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'

const STEPS = [
  {
    id: 'seed',
    label: 'Run the database seed',
    desc: 'Run seed.sql in Supabase to populate events, ministries, gallery, and leadership data.',
    link: null,
    linkLabel: null,
    check: async () => {
      try {
        const data = await eventsAPI.getAll({ limit: 1 })
        return (data.events?.length || 0) > 0
      } catch { return false }
    },
  },
  {
    id: 'leadership',
    label: 'Add leadership profiles',
    desc: 'Add the current EC members and patrons so they appear on the About page.',
    link: '/admin/leadership',
    linkLabel: 'Go to Leadership',
    check: async () => {
      try {
        const data = await leadershipAPI.getAll()
        return (data.leadership?.length || 0) > 0
      } catch { return false }
    },
  },
  {
    id: 'events',
    label: 'Add upcoming events',
    desc: 'Publish at least one upcoming event so the homepage shows current programs.',
    link: '/admin/events',
    linkLabel: 'Add Events',
    check: async () => {
      try {
        const today = new Date().toISOString().split('T')[0]
        const data = await eventsAPI.getAll({ limit: 1 })
        return (data.events || []).some(e => e.date >= today)
      } catch { return false }
    },
  },
  {
    id: 'blog',
    label: 'Publish your first blog post',
    desc: 'Write and publish a blog post to start engaging your community.',
    link: '/admin/blogs',
    linkLabel: 'Write a Blog Post',
    check: async () => {
      try {
        const data = await blogsAPI.getAllAdmin()
        return (data.blogs || []).some(b => b.status === 'published')
      } catch { return false }
    },
  },
  {
    id: 'email',
    label: 'Test your email configuration',
    desc: 'Verify that Brevo is configured so confirmation emails are sent correctly.',
    link: '/admin/settings',
    linkLabel: 'Go to Settings → AI & Email',
    check: async () => {
      try {
        const res = await fetch('/api/health')
        const data = await res.json()
        return data.email?.configured === true
      } catch { return false }
    },
  },
  {
    id: 'team',
    label: 'Invite your team members',
    desc: 'Invite the Content Manager, Gallery Manager, and other team members.',
    link: '/admin/users',
    linkLabel: 'Invite Users',
    check: async () => {
      try {
        const data = await adminAPI.dashboard()
        // Check localStorage for dismissed
        return localStorage.getItem('mutcu_team_invited') === 'true'
      } catch { return false }
    },
  },
]

export default function OnboardingChecklist({ onDismiss }) {
  const [checks, setChecks] = useState({})
  const [loading, setLoading] = useState(true)
  const [collapsed, setCollapsed] = useState(false)

  useEffect(() => {
    const runChecks = async () => {
      setLoading(true)
      const results = {}
      await Promise.allSettled(
        STEPS.map(async step => {
          try { results[step.id] = await step.check() }
          catch { results[step.id] = false }
        })
      )
      setChecks(results)
      setLoading(false)
    }
    runChecks()
  }, [])

  const completed = Object.values(checks).filter(Boolean).length
  const total = STEPS.length
  const allDone = completed === total
  const pct = Math.round((completed / total) * 100)

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-6">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange/10 flex items-center justify-center">
            <Sparkles size={16} className="text-orange" />
          </div>
          <div>
            <div className="font-montserrat font-black text-navy text-sm flex items-center gap-2">
              Getting Started
              {allDone && <span className="text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full">Complete! 🎉</span>}
            </div>
            <div className="text-gray-400 text-xs mt-0.5">{completed}/{total} steps completed</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setCollapsed(!collapsed)} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors">
            {collapsed ? <ChevronDown size={15} /> : <ChevronUp size={15} />}
          </button>
          <button onClick={onDismiss} className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-navy transition-colors" title="Dismiss">
            <X size={15} />
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100">
        <div className="h-full bg-orange transition-all duration-500 rounded-full" style={{ width: `${pct}%` }} />
      </div>

      {/* Steps */}
      {!collapsed && (
        <div className="p-4 space-y-2">
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-orange" />
            </div>
          ) : (
            STEPS.map(step => {
              const done = checks[step.id]
              return (
                <div key={step.id} className={`flex items-start gap-3 p-3 rounded-xl transition-colors ${done ? 'bg-green-50' : 'bg-gray-50'}`}>
                  <div className="flex-shrink-0 mt-0.5">
                    {done
                      ? <CheckCircle size={18} className="text-green-500" />
                      : <Circle size={18} className="text-gray-300" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`font-montserrat font-bold text-sm ${done ? 'text-green-700 line-through opacity-70' : 'text-navy'}`}>
                      {step.label}
                    </div>
                    {!done && <p className="text-gray-500 text-xs mt-0.5 leading-relaxed">{step.desc}</p>}
                  </div>
                  {!done && step.link && (
                    <Link to={step.link}
                      className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold text-white transition-all hover:-translate-y-0.5"
                      style={{ background: '#FF9700' }}>
                      {step.linkLabel}
                    </Link>
                  )}
                  {step.id === 'team' && !done && (
                    <button
                      onClick={() => { localStorage.setItem('mutcu_team_invited', 'true'); setChecks(c => ({ ...c, team: true })) }}
                      className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-montserrat font-bold text-orange border border-orange/30 hover:bg-orange/5 transition-all">
                      Mark done
                    </button>
                  )}
                </div>
              )
            })
          )}
          {allDone && (
            <div className="text-center py-3">
              <p className="text-green-600 font-montserrat font-bold text-sm">🎉 You're all set! The MUTCU website is ready.</p>
              <button onClick={onDismiss} className="text-xs text-gray-400 hover:text-orange transition-colors mt-1 font-montserrat">
                Dismiss this checklist
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}