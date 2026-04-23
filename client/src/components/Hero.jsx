import { useRef, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float, Stars, MeshDistortMaterial, Sphere, Torus } from '@react-three/drei'
import { motion, useScroll, useTransform } from 'framer-motion'
import { FiGithub, FiLinkedin, FiTwitter, FiArrowDown } from 'react-icons/fi'
import * as THREE from 'three'

/* ── 3D Scene Objects ── */
function DistortSphere({ position, color, scale = 1, speed = 1, distort = 0.4 }) {
  const mesh = useRef()
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.15 * speed
    mesh.current.rotation.y = state.clock.elapsedTime * 0.2 * speed
  })
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1.5}>
      <Sphere ref={mesh} args={[1, 80, 80]} scale={scale} position={position}>
        <MeshDistortMaterial
          color={color}
          distort={distort}
          speed={3}
          roughness={0.1}
          metalness={0.6}
          transparent
          opacity={0.85}
        />
      </Sphere>
    </Float>
  )
}

function WireframeTorus({ position, scale = 1 }) {
  const mesh = useRef()
  useFrame((s) => {
    mesh.current.rotation.x = s.clock.elapsedTime * 0.3
    mesh.current.rotation.z = s.clock.elapsedTime * 0.15
  })
  return (
    <Float speed={1.5} floatIntensity={1}>
      <mesh ref={mesh} position={position} scale={scale}>
        <torusGeometry args={[1, 0.3, 16, 60]} />
        <meshStandardMaterial
          color="#7c3aed"
          wireframe
          transparent
          opacity={0.35}
        />
      </mesh>
    </Float>
  )
}

function FloatingRings() {
  const group = useRef()
  useFrame((s) => {
    group.current.rotation.y = s.clock.elapsedTime * 0.08
  })
  return (
    <group ref={group}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[Math.PI / 2, 0, (i * Math.PI) / 3]}>
          <torusGeometry args={[3 + i * 0.8, 0.015, 8, 100]} />
          <meshStandardMaterial
            color={i % 2 === 0 ? '#7c3aed' : '#06b6d4'}
            transparent
            opacity={0.2}
          />
        </mesh>
      ))}
    </group>
  )
}

function ParticleDots() {
  const count = 200
  const positions = new Float32Array(count * 3)
  for (let i = 0; i < count; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 10
  }
  const geo = useRef()
  useFrame((s) => {
    if (geo.current) {
      geo.current.rotation.y = s.clock.elapsedTime * 0.02
    }
  })
  return (
    <points ref={geo}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#7c3aed" size={0.04} transparent opacity={0.6} />
    </points>
  )
}

function CameraController() {
  const { camera } = useThree()
  const mouse = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
      mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
    }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [])
  useFrame(() => {
    camera.position.x += (mouse.current.x * 0.5 - camera.position.x) * 0.04
    camera.position.y += (mouse.current.y * 0.3 - camera.position.y) * 0.04
    camera.lookAt(0, 0, 0)
  })
  return null
}

/* ── Typing animation hook ── */
function useTyping(words, speed = 100, pause = 1800) {
  const [displayed, setDisplayed] = useState('')
  const [index, setIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = words[index % words.length]
    let timer
    if (!deleting && displayed.length < word.length) {
      timer = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), speed)
    } else if (!deleting && displayed.length === word.length) {
      timer = setTimeout(() => setDeleting(true), pause)
    } else if (deleting && displayed.length > 0) {
      timer = setTimeout(() => setDisplayed(displayed.slice(0, -1)), speed / 2)
    } else if (deleting && displayed.length === 0) {
      setDeleting(false)
      setIndex((i) => i + 1)
    }
    return () => clearTimeout(timer)
  }, [displayed, deleting, index, words, speed, pause])

  return displayed
}

/* ── Hero Component ── */
export default function Hero() {
  const containerRef = useRef()
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '30%'])
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  const typedText = useTyping([
    'Full Stack Developer',
    'React & Node.js Expert',
    'UI/UX Enthusiast',
    '3D Web Creator',
  ])

  const socials = [
    { icon: FiGithub, href: 'https://github.com', label: 'GitHub' },
    { icon: FiLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
    { icon: FiTwitter, href: 'https://twitter.com', label: 'Twitter' },
  ]

  return (
    <section
      ref={containerRef}
      id="home"
      className="relative w-full min-h-screen flex items-center overflow-hidden bg-grid"
      style={{ background: '#05050a' }}
    >
      {/* 3D Canvas */}
      <div className="absolute inset-0 z-0">
        <Canvas
          camera={{ position: [0, 0, 6], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: 'transparent' }}
        >
          <Suspense fallback={null}>
            <CameraController />
            <ambientLight intensity={0.3} />
            <pointLight position={[5, 5, 5]} intensity={1.5} color="#7c3aed" />
            <pointLight position={[-5, -3, 3]} intensity={1} color="#06b6d4" />
            <Stars radius={60} depth={30} count={3000} factor={2} saturation={0} fade speed={0.5} />
            <ParticleDots />
            <FloatingRings />
            <DistortSphere position={[3.5, 0.5, -1]} color="#7c3aed" scale={1.4} speed={0.8} distort={0.5} />
            <DistortSphere position={[-3.8, -1, -2]} color="#06b6d4" scale={0.9} speed={1.2} distort={0.3} />
            <DistortSphere position={[0.5, 2.5, -3]} color="#8b5cf6" scale={0.6} speed={1.5} distort={0.6} />
            <WireframeTorus position={[-2.5, 1.5, -1]} scale={0.8} />
            <WireframeTorus position={[2, -2, -0.5]} scale={0.5} />
          </Suspense>
        </Canvas>
      </div>

      {/* Gradient overlays */}
      <div className="absolute inset-0 z-10 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 50%, transparent 30%, rgba(5,5,10,0.7) 100%)' }} />
      <div className="absolute bottom-0 left-0 right-0 h-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(to top, #05050a, transparent)' }} />

      {/* Content */}
      <motion.div
        style={{ y, opacity }}
        className="relative z-20 max-w-6xl mx-auto px-6 pt-24 pb-16 w-full"
      >
        <div className="max-w-3xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 border border-purple-600/20"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-slate-300 text-sm font-inter">Available for opportunities</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.7 }}
            className="font-grotesk font-bold leading-tight mb-4"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)' }}
          >
            Hi, I'm{' '}
            <span className="gradient-text text-glow">Anh Toan</span>
            <br />
            <span className="text-slate-200">Developer &</span>
            <br />
            <span className="text-slate-400">Creator</span>
          </motion.h1>

          {/* Typing text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex items-center gap-2 mb-6"
          >
            <span className="font-grotesk font-medium text-xl md:text-2xl text-slate-300">
              {typedText}
            </span>
            <span className="w-0.5 h-7 bg-purple-500 typing-cursor" />
          </motion.div>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="font-inter text-slate-400 text-lg leading-relaxed max-w-xl mb-10"
          >
            I craft beautiful, high-performance web experiences using modern technologies.
            Passionate about turning ideas into{' '}
            <span className="text-purple-400">stunning digital realities</span>.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="flex flex-wrap gap-4 mb-12"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(124,58,237,0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full font-grotesk font-medium text-white text-base"
              style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }}
            >
              View My Work
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, borderColor: '#7c3aed', color: 'white' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-4 rounded-full font-grotesk font-medium text-purple-400 border border-purple-600/50 transition-colors"
            >
              Contact Me
            </motion.button>
          </motion.div>

          {/* Social links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="flex items-center gap-5"
          >
            {socials.map(({ icon: Icon, href, label }, i) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                whileHover={{ scale: 1.2, color: '#a78bfa' }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.9 + i * 0.1 }}
                className="text-slate-500 hover:text-purple-400 transition-colors text-xl"
              >
                <Icon />
              </motion.a>
            ))}
            <div className="h-px w-12 ml-2" style={{ background: 'rgba(255,255,255,0.1)' }} />
            <span className="text-slate-600 text-xs font-inter">mranhtoandt@gmail.com</span>
          </motion.div>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
      >
        <span className="text-slate-600 text-xs font-inter tracking-widest uppercase">Scroll</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
          className="text-slate-600"
        >
          <FiArrowDown size={18} />
        </motion.div>
      </motion.div>
    </section>
  )
}
