import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loader() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) { clearInterval(interval); return 100 }
        return prev + Math.random() * 15 + 5
      })
    }, 120)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      className="loader-overlay flex-col gap-8"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
        className="relative"
      >
        <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}>
          <span className="font-grotesk font-bold text-white text-2xl">&lt;/&gt;</span>
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
          animate={{ opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>

      {/* Name */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        <h1 className="font-grotesk font-bold text-2xl gradient-text">Portfolio</h1>
        <p className="text-slate-500 text-sm mt-1 font-inter">Loading experience...</p>
      </motion.div>

      {/* Progress bar */}
      <motion.div
        className="w-48 h-1 rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }}
          initial={{ width: '0%' }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Percentage */}
      <motion.span
        className="text-slate-500 text-xs font-inter tabular-nums"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        {Math.min(Math.floor(progress), 100)}%
      </motion.span>
    </motion.div>
  )
}
