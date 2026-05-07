import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import api from '../utils/api'
import toast from 'react-hot-toast'
import { FiMail, FiArrowLeft } from 'react-icons/fi'

const schema = z.object({
  email: z.string().email('Invalid email address'),
})

export default function ForgotPassword() {
  const { register, handleSubmit, formState: { errors, isSubmitting, isSubmitSuccessful } } = useForm({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    document.body.style.cursor = 'auto'
    return () => { document.body.style.cursor = '' }
  }, [])

  async function onSubmit(data) {
    try {
      await api.post('/api/auth/forgot-password', { email: data.email })
    } catch {
      // Always show same message to prevent email enumeration
    }
  }

  if (isSubmitSuccessful) {
    return (
      <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center p-4">
        <div className="w-full max-w-md text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/20 border border-green-500/30 mb-6">
            <FiMail className="w-7 h-7 text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Check your email</h2>
          <p className="text-gray-400 mb-6">
            If that email exists, we've sent a reset link.<br />
            The link expires in <strong className="text-white">15 minutes</strong>.
          </p>
          <Link to="/admin/login" className="text-purple-400 hover:text-purple-300 transition-colors text-sm flex items-center justify-center gap-2">
            <FiArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-900 bg-grid flex items-center justify-center p-4">
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-600 to-cyan-500 mb-4 shadow-lg shadow-purple-500/30">
            <FiMail className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Forgot password?</h1>
          <p className="text-gray-400 text-sm mt-1">Enter your email and we'll send a reset link</p>
        </div>

        <div className="glass rounded-2xl p-8 border border-white/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
                <input
                  {...register('email')}
                  type="email"
                  className="input-field pl-10 w-full"
                  placeholder="admin@example.com"
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-cyan-500 text-white font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2">
              {isSubmitting
                ? <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />Sending…</>
                : 'Send Reset Link'}
            </button>
          </form>
        </div>

        <p className="text-center text-sm mt-6">
          <Link to="/admin/login" className="text-gray-500 hover:text-gray-300 transition-colors flex items-center justify-center gap-1">
            <FiArrowLeft className="w-3 h-3" /> Back to login
          </Link>
        </p>
      </div>
    </div>
  )
}
