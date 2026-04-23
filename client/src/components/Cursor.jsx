import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current
    let mouseX = 0, mouseY = 0

    const moveCursor = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      gsap.to(dot, { x: mouseX, y: mouseY, duration: 0.08, ease: 'power2.out' })
      gsap.to(ring, { x: mouseX, y: mouseY, duration: 0.35, ease: 'power2.out' })
    }

    const handleEnter = () => ring.classList.add('hovered')
    const handleLeave = () => ring.classList.remove('hovered')

    const targets = document.querySelectorAll('a, button, [data-cursor]')

    window.addEventListener('mousemove', moveCursor)
    targets.forEach(el => {
      el.addEventListener('mouseenter', handleEnter)
      el.addEventListener('mouseleave', handleLeave)
    })

    const observer = new MutationObserver(() => {
      const newTargets = document.querySelectorAll('a, button, [data-cursor]')
      newTargets.forEach(el => {
        el.addEventListener('mouseenter', handleEnter)
        el.addEventListener('mouseleave', handleLeave)
      })
    })

    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', moveCursor)
      observer.disconnect()
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
