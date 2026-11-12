import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import { adminUsersAPI, setToken } from '../../lib/api'
import { useAuth } from '../../context/AuthContext'
import { Eye, EyeOff, CheckCircle, AlertCircle, Loader } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AcceptInvitePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { login } = useAuth()
  const token = searchParams.get('token')

  const [step, setStep] = useState('loading') // loading | valid | invalid | success
  const [inviteData, setInviteData] = useState(null)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) { setStep('invalid'); return }
    adminUsersAPI.validateInvite(token)
      .then(data => { setInviteData(data.user); setStep('valid') })
      .catch(err => { setStep('invalid'); setError(err.message || 'Invalid or expired invitation link.') })
  }, [token])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password.length < 8) return setError('Password must be at least 8 characters')
    if (password !== confirmPassword) return setError('Passwords do not match')
    setSubmitting(true)
    try {
      const data = await adminUsersAPI.acceptInvite(token, password)
      setToken(data.token)
      setStep('success')
      toast.success('Account activated! Welcome to MUTCU Admin.')
      setTimeout(() => navigate('/admin'), 2000)
    } catch (err) {
      setError(err.message || 'Failed to activate account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const passwordStrength = (p) => {
    if (!p) return { score: 0, label: '', color: '' }
    let score = 0
    if (p.length >= 8) score++
    if (p.length >= 12) score++
    if (/[A-Z]/.test(p)) score++
    if (/[0-9]/.test(p)) score++
    if (/[^A-Za-z0-9]/.test(p)) score++
    if (score <= 1) return { score, label: 'Weak', color: 'bg-red-400' }
    if (score <= 3) return { score, label: 'Fair', color: 'bg-yellow-400' }
    return { score, label: 'Strong', color: 'bg-green-500' }
  }

  const strength = passwordStrength(password)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/">
            <img src="/assets/images/best logo.png" alt="MUTCU" className="h-16 mx-auto mb-3"
              onError={e => { e.target.style.display = 'none' }} />
          </Link>
          <h1 className="font-montserrat font-black text-navy text-2xl">MUTCU Admin</h1>
          <p className="text-gray-400 text-sm mt-1">Accept Your Invitation</p>
        </div>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-1.5 w-full" style={{ background: 'linear-gradient(90deg, #04003D, #FF9700, #30D5C8)' }} />

          <div className="p-7 sm:p-8">
            {/* Loading */}
            {step === 'loading' && (
              <div className="text-center py-8">
                <Loader size={32} className="text-orange animate-spin mx-auto mb-3" />
                <p className="text-gray-500 font-montserrat font-semibold text-sm">Validating your invitation...</p>
              </div>
            )}

            {/* Invalid */}
            {step === 'invalid' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle size={28} className="text-red-500" />
                </div>
                <h2 className="font-montserrat font-black text-navy text-xl mb-2">Invalid Invitation</h2>
                <p className="text-gray-500 text-sm mb-6 leading-relaxed">{error || 'This invitation link is invalid or has expired. Please ask your admin to resend it.'}</p>
                <Link to="/admin/login" className="btn-primary btn-sm">
                  Go to Login
                </Link>
              </div>
            )}

            {/* Success */}
            {step === 'success' && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={28} className="text-green-500" />
                </div>
                <h2 className="font-montserrat font-black text-navy text-xl mb-2">Account Activated!</h2>
                <p className="text-gray-500 text-sm mb-2">Welcome to the MUTCU admin dashboard, {inviteData?.name}!</p>
                <p className="text-gray-400 text-xs">Redirecting you to the dashboard...</p>
                <div className="mt-4 flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange" />
                </div>
              </div>
            )}

            {/* Set password form */}
            {step === 'valid' && inviteData && (
              <>
                {/* Welcome message */}
                <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(255,151,0,0.06)', border: '1px solid rgba(255,151,0,0.2)' }}>
                  <p className="font-montserrat font-black text-navy text-base mb-0.5">Hi {inviteData.name}! 👋</p>
                  <p className="text-gray-500 text-sm">You've been invited as <strong className="text-orange">{inviteData.website_role?.replace(/_/g, ' ')}</strong>. Set your password to get started.</p>
                </div>

                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 mb-4">
                    <AlertCircle size={15} className="text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-red-700 text-sm font-montserrat font-semibold">{error}</p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Email (read-only) */}
                  <div>
                    <label className="form-label">Email Address</label>
                    <input type="email" value={inviteData.email} readOnly
                      className="form-input bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>

                  {/* Password */}
                  <div>
                    <label className="form-label">Set Password *</label>
                    <div className="relative">
                      <input type={showPass ? 'text' : 'password'} value={password}
                        onChange={e => { setPassword(e.target.value); setError('') }}
                        className="form-input pr-10" placeholder="At least 8 characters" required minLength={8} />
                      <button type="button" onClick={() => setShowPass(!showPass)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {/* Password strength */}
                    {password && (
                      <div className="mt-2">
                        <div className="flex gap-1 mb-1">
                          {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={`flex-1 h-1 rounded-full transition-all ${i <= strength.score ? strength.color : 'bg-gray-200'}`} />
                          ))}
                        </div>
                        <p className={`text-xs font-montserrat font-semibold ${strength.score <= 1 ? 'text-red-500' : strength.score <= 3 ? 'text-yellow-600' : 'text-green-600'}`}>
                          {strength.label}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="form-label">Confirm Password *</label>
                    <div className="relative">
                      <input type={showConfirm ? 'text' : 'password'} value={confirmPassword}
                        onChange={e => { setConfirmPassword(e.target.value); setError('') }}
                        className={`form-input pr-10 ${confirmPassword && confirmPassword !== password ? 'border-red-300' : confirmPassword && confirmPassword === password ? 'border-green-400' : ''}`}
                        placeholder="Repeat your password" required />
                      <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {confirmPassword && confirmPassword !== password && (
                      <p className="text-red-500 text-xs mt-1 font-montserrat font-semibold">Passwords do not match</p>
                    )}
                    {confirmPassword && confirmPassword === password && (
                      <p className="text-green-600 text-xs mt-1 font-montserrat font-semibold flex items-center gap-1">
                        <CheckCircle size={11} />Passwords match
                      </p>
                    )}
                  </div>

                  <button type="submit" disabled={submitting || !password || !confirmPassword || password !== confirmPassword}
                    className="btn-primary w-full justify-center btn-lg mt-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none">
                    {submitting ? (
                      <><div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />Activating...</>
                    ) : (
                      <><CheckCircle size={16} />Activate My Account</>
                    )}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>

        <p className="text-center text-gray-400 text-xs mt-6 font-montserrat">
          © {new Date().getFullYear()} MUTCU · Inspire Love, Hope & Godliness
        </p>
      </div>
    </div>
  )
}