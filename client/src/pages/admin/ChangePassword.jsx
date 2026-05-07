import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import api from '../../utils/api'
import toast from 'react-hot-toast'
import { FiLock, FiEye, FiEyeOff, FiShield } from 'react-icons/fi'
import zxcvbn from 'zxcvbn'

const schema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'At least 8 characters'),
  confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, { message: 'Passwords do not match', path: ['confirm'] })

const strengthLabel = ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
const strengthColor = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-400', 'bg-emerald-500']

export default function ChangePassword() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [strength, setStrength] = useState(0)
  const { user, setUser } = useAuth()
  const navigate = useNavigate()

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    document.body.style.cursor = 'auto'
    return () => { document.body.style.cursor = '' }
  }, [])

  const newPassValue = watch('newPassword', '')
  useEffect(() => {
    if (newPassValue) setStrength(zxcvbn(newPassValue).score)
    else setStrength(0)
  }, [newPassValue])

  async function onSubmit(data) {
    try {
      await api.put('/api/auth/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      })
      toast.success('Password changed successfully!')
      // Clear mustChangePassword flag locally
      if (user) setUser({ ...user, mustChangePassword: false })
      navigate('/admin')
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to change password')
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center p-4">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 mb-4 shadow-lg shadow-purple-500/30">
            <FiShield className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">
            {user?.mustChangePassword ? 'Set your password' : 'Change password'}
          </h1>
          {user?.mustChangePassword && (
            <p className="text-amber-400 text-sm mt-2 bg-amber-400/10 border border-amber-400/20 rounded-lg px-3 py-2">
              Please set a new password before continuing
            </p>
          )}
        </div>

        <div className="glass rounded-2xl p-8 border border-white/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  {...register('currentPassword')}
                  type={showCurrent ? 'text' : 'password'}
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showCurrent ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {errors.currentPassword && <p className="text-red-400 text-xs mt-1">{errors.currentPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  {...register('newPassword')}
                  type={showNew ? 'text' : 'password'}
                  className="input-field pl-10 pr-10 w-full"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                  {showNew ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
                </button>
              </div>
              {newPassValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < strength ? strengthColor[strength] : 'bg-white/10'}`} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">{strengthLabel[strength]}</p>
                </div>
              )}
              {errors.newPassword && <p className="text-red-400 text-xs mt-1">{errors.newPassword.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirm New Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  {...register('confirm')}
                  type={showNew ? 'text' : 'password'}
                  className="input-field pl-10 w-full"
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
              </div>
              {errors.confirm && <p className="text-red-400 text-xs mt-1">{errors.confirm.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Saving…</>
                : 'Save New Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
