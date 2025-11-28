import { useEffect, useRef } from 'react'

export default function SpaceBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Stars
    const stars: { x: number; y: number; size: number; speed: number; opacity: number }[] = []
    for (let i = 0; i < 150; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
      })
    }

    // Shooting stars
    let shootingStars: { x: number; y: number; length: number; speed: number; opacity: number }[] = []

    const createShootingStar = () => {
      if (Math.random() < 0.02 && shootingStars.length < 3) {
        shootingStars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * (canvas.height / 2),
          length: Math.random() * 80 + 40,
          speed: Math.random() * 5 + 8,
          opacity: 1,
        })
      }
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(10, 10, 15, 0.15)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach(star => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity * (0.8 + Math.sin(Date.now() * 0.002 + star.x) * 0.2)})`
        ctx.fill()

        star.y += star.speed
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      // Draw and update shooting stars
      createShootingStar()
      shootingStars.forEach((star, index) => {
        const gradient = ctx.createLinearGradient(star.x, star.y, star.x - star.length, star.y - star.length / 2)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.beginPath()
        ctx.moveTo(star.x, star.y)
        ctx.lineTo(star.x - star.length, star.y - star.length / 2)
        ctx.strokeStyle = gradient
        ctx.lineWidth = 1.5
        ctx.stroke()

        star.x += star.speed
        star.y += star.speed / 2
        star.opacity -= 0.02

        if (star.opacity <= 0 || star.x > canvas.width || star.y > canvas.height) {
          shootingStars.splice(index, 1)
        }
      })

      requestAnimationFrame(animate)
    }

    // Initial fill
    ctx.fillStyle = '#0a0a0f'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    animate()

    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 z-0" />
      {/* Gradient overlay */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
      {/* Noise texture */}
      <div className="fixed inset-0 z-0 opacity-[0.015]" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
      }} />
    </>
  )
}

