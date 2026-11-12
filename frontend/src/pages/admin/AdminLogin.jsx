import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'
import { Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setError('')
    setLoading(true)
    try {
      await login(email.trim(), password)
      toast.success('Welcome back!')
      navigate('/admin')
    } catch (err) {
      const msg = err.message || 'Invalid credentials'
      setError(msg)
      // Shake animation
      const form = document.getElementById('login-form')
      form?.classList.add('animate-shake')
      setTimeout(() => form?.classList.remove('animate-shake'), 500)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo + branding */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img src="/assets/images/best logo.png" alt="MUTCU" className="h-16 mx-auto mb-3"
              onError={e => { e.target.style.display = 'none' }} />
          </Link>
          <h1 className="font-montserrat font-black text-navy text-2xl">MUTCU Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Website Management System</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          {/* Top accent */}
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #04003D, #FF9700, #30D5C8)' }} />

          <div className="p-7 sm:p-8">
            <h2 className="font-montserrat font-black text-navy text-xl mb-6">Sign In</h2>

            {/* Error banner */}
            {error && (
              <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 mb-5">
                <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-red-700 text-sm font-montserrat font-semibold">{error}</p>
                  {error.toLowerCase().includes('admin') && (
                    <p className="text-red-500 text-xs mt-0.5">Your account needs super_admin, ec_admin, or cu_secretary role.</p>
                  )}
                </div>
              </div>
            )}

            <form id="login-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className={`form-input transition-all ${error ? 'border-red-300 focus:border-red-400' : ''}`}
                  placeholder="admin@mutcu.org"
                  required
                  autoFocus
                  autoComplete="email"
                />
              </div>

              {/* Password */}
              <div>
                <label className="form-label">Password</label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError('') }}
                    className={`form-input pr-10 transition-all ${error ? 'border-red-300 focus:border-red-400' : ''}`}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email.trim() || !password}
                className="btn-primary w-full justify-center btn-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                {loading ? (
                  <>
                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn size={16} /> Sign In
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-5 border-t border-gray-100">
              <div className="flex items-start gap-2 p-3 rounded-xl bg-gray-50 mb-4">
                <i className="fas fa-info-circle text-gray-400 text-xs mt-0.5 flex-shrink-0" />
                <p className="text-gray-400 text-xs leading-relaxed">
                  Use your <strong className="text-navy">MUTCU DMS credentials</strong>. Your account must have the role <code className="bg-gray-200 px-1 rounded text-xs">super_admin</code>, <code className="bg-gray-200 px-1 rounded text-xs">ec_admin</code>, or <code className="bg-gray-200 px-1 rounded text-xs">cu_secretary</code>.
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Link to="/" className="text-orange text-sm hover:underline font-montserrat font-semibold flex items-center gap-1">
                  <i className="fas fa-arrow-left text-xs" /> Back to Website
                </Link>
                <a href="https://portal.mutcu.org" target="_blank" rel="noopener noreferrer"
                  className="text-gray-400 text-xs hover:text-orange transition-colors font-montserrat font-semibold">
                  DMS Portal →
                </a>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 font-montserrat">
          © {new Date().getFullYear()} MUTCU · Inspire Love, Hope & Godliness
        </p>
      </div>

      {/* Shake animation style */}
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0) }
          20% { transform: translateX(-6px) }
          40% { transform: translateX(6px) }
          60% { transform: translateX(-4px) }
          80% { transform: translateX(4px) }
        }
        .animate-shake { animation: shake 0.4s ease-in-out }
      `}</style>
    </div>
  )
}