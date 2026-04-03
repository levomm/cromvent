"use client"

import { useEffect, forwardRef, useImperativeHandle, useRef } from "react"
import { smoothNoise } from "@/lib/noise"

interface ImageCanvasProps {
  image: HTMLImageElement
  halftoneSize: number
  contrast: number
  accentColor: string
  mouseRadius: number
  repulsionStrength: number
  returnSpeed: number
  accentProbability: number
  sizeVariation: number
}

interface DotData {
  x: number
  y: number
  baseX: number
  baseY: number
  baseSize: number
  brightness: number
  isAccent: boolean
  sizeMultiplier: number
  twinklePhase: number
  twinkleSpeed: number
  vx: number
  vy: number
}

interface TrailPoint {
  x: number
  y: number
  timestamp: number
  strength: number
}

export const ImageCanvas = forwardRef<HTMLCanvasElement, ImageCanvasProps>(
  (
    {
      image,
      halftoneSize,
      contrast,
      accentColor,
      mouseRadius,
      repulsionStrength,
      returnSpeed,
      accentProbability,
      sizeVariation,
    },
    ref,
  ) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const animationFrameRef = useRef<number | null>(null)
    const mouseRef = useRef({
      x: -1000,
      y: -1000,
      prevX: -1000,
      prevY: -1000,
    })
    const isFirstMoveRef = useRef(true)
    const lastMoveTimeRef = useRef(0)
    const mouseTrailRef = useRef<TrailPoint[]>([])

    useImperativeHandle(ref, () => canvasRef.current!)

    useEffect(() => {
      if (!canvasRef.current || !image) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d", { willReadFrequently: true })
      if (!ctx) return

      const MAX_WIDTH = 720
      const MAX_HEIGHT = 480

      const scaleX = MAX_WIDTH / image.width
      const scaleY = MAX_HEIGHT / image.height
      const scale = Math.min(1, scaleX, scaleY)

      const dpr = window.devicePixelRatio || 1
      const displayWidth = image.width * scale
      const displayHeight = image.height * scale

      canvas.width = displayWidth * dpr
      canvas.height = displayHeight * dpr
      canvas.style.width = `${displayWidth}px`
      canvas.style.height = `${displayHeight}px`
      canvas.style.touchAction = "none"

      ctx.setTransform(1, 0, 0, 1, 0, 0)
      ctx.scale(dpr, dpr)
      ctx.imageSmoothingEnabled = false

      ctx.drawImage(image, 0, 0, displayWidth, displayHeight)

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData.data

      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, ((data[i] / 255 - 0.5) * contrast + 0.5) * 255))
        data[i + 1] = Math.max(0, Math.min(255, ((data[i + 1] / 255 - 0.5) * contrast + 0.5) * 255))
        data[i + 2] = Math.max(0, Math.min(255, ((data[i + 2] / 255 - 0.5) * contrast + 0.5) * 255))
      }

      const dots: DotData[] = []
      const adjustedHalftoneSize = Math.max(2, halftoneSize * scale)

      for (let y = 0; y < displayHeight; y += adjustedHalftoneSize) {
        for (let x = 0; x < displayWidth; x += adjustedHalftoneSize) {
          const sampleX = Math.floor(x * dpr)
          const sampleY = Math.floor(y * dpr)
          const i = (sampleY * canvas.width + sampleX) * 4

          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3
          const dotSize = (brightness / 255) * adjustedHalftoneSize * 0.9

          if (dotSize > 0.5) {
            const centerX = x + adjustedHalftoneSize / 2
            const centerY = y + adjustedHalftoneSize / 2
            const sizeMultiplier = 1 + (Math.random() - 0.5) * sizeVariation
            const isAccent = Math.random() < accentProbability && brightness > 150

            dots.push({
              x: centerX,
              y: centerY,
              baseX: centerX,
              baseY: centerY,
              baseSize: dotSize,
              brightness,
              isAccent,
              sizeMultiplier,
              twinklePhase: Math.random() * Math.PI * 2,
              twinkleSpeed: 0.02 + Math.random() * 0.03,
              vx: 0,
              vy: 0,
            })
          }
        }
      }

      const pushTrailPoint = (newX: number, newY: number) => {
        lastMoveTimeRef.current = Date.now()

        if (isFirstMoveRef.current) {
          mouseRef.current.x = newX
          mouseRef.current.y = newY
          mouseRef.current.prevX = newX
          mouseRef.current.prevY = newY
          isFirstMoveRef.current = false
          return
        }

        mouseRef.current.prevX = mouseRef.current.x
        mouseRef.current.prevY = mouseRef.current.y
        mouseRef.current.x = newX
        mouseRef.current.y = newY

        const velX = newX - mouseRef.current.prevX
        const velY = newY - mouseRef.current.prevY
        const speed = Math.sqrt(velX * velX + velY * velY)
        const steps = Math.max(1, Math.ceil(speed / 10))

        for (let i = 0; i < steps; i++) {
          const t = i / steps
          const interpX = mouseRef.current.prevX + velX * t
          const interpY = mouseRef.current.prevY + velY * t

          mouseTrailRef.current.push({
            x: interpX,
            y: interpY,
            timestamp: Date.now(),
            strength: Math.min(speed / 10, 1),
          })
        }

        const now = Date.now()
        mouseTrailRef.current = mouseTrailRef.current.filter((point) => now - point.timestamp < 150)
      }

      const updatePointerFromViewport = (clientX: number, clientY: number) => {
        const rect = canvas.getBoundingClientRect()
        const newX = clientX - rect.left
        const newY = clientY - rect.top
        pushTrailPoint(newX, newY)
      }

      const handleMouseMove = (e: MouseEvent) => {
        updatePointerFromViewport(e.clientX, e.clientY)
      }

      const handleTouchStart = (e: TouchEvent) => {
        if (!e.touches.length) return
        const touch = e.touches[0]
        updatePointerFromViewport(touch.clientX, touch.clientY)
      }

      const handleTouchMove = (e: TouchEvent) => {
        e.preventDefault()
        if (!e.touches.length) return
        const touch = e.touches[0]
        updatePointerFromViewport(touch.clientX, touch.clientY)
      }

      const resetPointer = () => {
        mouseTrailRef.current = []
        mouseRef.current.x = -1000
        mouseRef.current.y = -1000
        mouseRef.current.prevX = -1000
        mouseRef.current.prevY = -1000
        isFirstMoveRef.current = true
      }

      const handleMouseLeave = () => {
        resetPointer()
      }

      const handleTouchEnd = () => {
        resetPointer()
      }

      const animate = () => {
        ctx.clearRect(0, 0, displayWidth, displayHeight)

        const timeSinceLastMove = Date.now() - lastMoveTimeRef.current
        const isPointerMoving = timeSinceLastMove < 100

        if (!isPointerMoving) {
          mouseTrailRef.current = []
        }

        const time = Date.now() * 0.001

        dots.forEach((dot) => {
          let maxDistanceFactor = 0
          let totalForceX = 0
          let totalForceY = 0

          if (mouseTrailRef.current.length > 0) {
            mouseTrailRef.current.forEach((trailPoint) => {
              const dx = trailPoint.x - dot.x
              const dy = trailPoint.y - dot.y
              const distance = Math.sqrt(dx * dx + dy * dy)

              if (distance > mouseRadius * 1.5) return

              const noiseValue = smoothNoise(dot.baseX, dot.baseY, 0.02, time)
              const irregularRadius = mouseRadius * (0.7 + noiseValue * 0.6)

              if (distance < irregularRadius) {
                const distanceFactor = 1 - distance / irregularRadius
                const smoothFactor = distanceFactor * distanceFactor * (3 - 2 * distanceFactor)
                maxDistanceFactor = Math.max(maxDistanceFactor, smoothFactor)

                if (distance > 0.1) {
                  const force = repulsionStrength * smoothFactor * trailPoint.strength * 0.5
                  totalForceX -= (dx / distance) * force
                  totalForceY -= (dy / distance) * force
                }
              }
            })
          }

          if (mouseRef.current.x > 0) {
            const dx = mouseRef.current.x - dot.x
            const dy = mouseRef.current.y - dot.y
            const distance = Math.sqrt(dx * dx + dy * dy)

            const noiseValue = smoothNoise(dot.baseX, dot.baseY, 0.02, time)
            const irregularRadius = mouseRadius * (0.7 + noiseValue * 0.6)

            if (distance < irregularRadius) {
              const distanceFactor = 1 - distance / irregularRadius
              const smoothFactor = distanceFactor * distanceFactor * (3 - 2 * distanceFactor)
              maxDistanceFactor = Math.max(maxDistanceFactor, smoothFactor)
            }
          }

          dot.vx += totalForceX
          dot.vy += totalForceY

          const returnForceX = (dot.baseX - dot.x) * returnSpeed * 0.1
          const returnForceY = (dot.baseY - dot.y) * returnSpeed * 0.1
          dot.vx += returnForceX
          dot.vy += returnForceY

          dot.vx *= 0.85
          dot.vy *= 0.85

          dot.x += dot.vx
          dot.y += dot.vy

          const currentSize = dot.baseSize * dot.sizeMultiplier

          let opacity = 1
          if (maxDistanceFactor > 0) {
            dot.twinklePhase += dot.twinkleSpeed
            const twinkle = Math.sin(dot.twinklePhase) * 0.5 + 0.5
            const twinkleAmount = (0.3 + twinkle * 0.7) * maxDistanceFactor
            opacity = 1 - (1 - twinkleAmount) * maxDistanceFactor
          }

          ctx.globalAlpha = opacity
          ctx.fillStyle = dot.isAccent ? accentColor : "#ffffff"
          ctx.beginPath()
          ctx.arc(dot.x, dot.y, currentSize / 2, 0, Math.PI * 2)
          ctx.fill()
          ctx.globalAlpha = 1
        })

        animationFrameRef.current = requestAnimationFrame(animate)
      }

      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("touchstart", handleTouchStart, { passive: false })
      window.addEventListener("touchmove", handleTouchMove, { passive: false })
      window.addEventListener("touchend", handleTouchEnd)
      window.addEventListener("touchcancel", handleTouchEnd)
      window.addEventListener("mouseleave", handleMouseLeave)

      animate()

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }
        window.removeEventListener("mousemove", handleMouseMove)
        window.removeEventListener("touchstart", handleTouchStart)
        window.removeEventListener("touchmove", handleTouchMove)
        window.removeEventListener("touchend", handleTouchEnd)
        window.removeEventListener("touchcancel", handleTouchEnd)
        window.removeEventListener("mouseleave", handleMouseLeave)
      }
    }, [
      image,
      halftoneSize,
      contrast,
      accentColor,
      mouseRadius,
      repulsionStrength,
      returnSpeed,
      accentProbability,
      sizeVariation,
    ])

    return (
      <div className="flex w-full justify-center overflow-visible">
        <canvas ref={canvasRef} className="block h-auto max-w-full bg-transparent" />
      </div>
    )
  },
)

ImageCanvas.displayName = "ImageCanvas"
