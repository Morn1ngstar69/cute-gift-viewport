import React, { useCallback, useEffect, useRef, useState } from 'react'
import { startChaseSound, stopChaseSound } from './AudioEngine.js'

const EDGE_MARGIN = 16
const DANGER_RADIUS = 165
const MOVE_DISTANCE = 170

const clamp = (value, min, max) => Math.min(Math.max(value, min), max)

export default function RunawayButton() {
  const buttonRef = useRef(null)
  const rafRef = useRef(null)
  const pointerRef = useRef({ x: -9999, y: -9999 })
  const intensityRef = useRef(0)
  const [position, setPosition] = useState(null)
  const [isChasing, setIsChasing] = useState(false)

  const getSafeBounds = useCallback(() => {
    const el = buttonRef.current
    const width = el?.offsetWidth || 220
    const height = el?.offsetHeight || 48
    return {
      minX: EDGE_MARGIN,
      minY: EDGE_MARGIN,
      maxX: Math.max(EDGE_MARGIN, window.innerWidth - width - EDGE_MARGIN),
      maxY: Math.max(EDGE_MARGIN, window.innerHeight - height - EDGE_MARGIN),
      width,
      height
    }
  }, [])

  const setInitialPosition = useCallback(() => {
    const bounds = getSafeBounds()
    setPosition({
      x: clamp(window.innerWidth * 0.58, bounds.minX, bounds.maxX),
      y: clamp(window.innerHeight * 0.72, bounds.minY, bounds.maxY)
    })
  }, [getSafeBounds])

  useEffect(() => {
    const timer = window.setTimeout(setInitialPosition, 50)
    const onResize = () => {
      const bounds = getSafeBounds()
      setPosition((prev) => {
        if (!prev) return prev
        return {
          x: clamp(prev.x, bounds.minX, bounds.maxX),
          y: clamp(prev.y, bounds.minY, bounds.maxY)
        }
      })
    }

    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      stopChaseSound()
    }
  }, [getSafeBounds, setInitialPosition])

  const evade = useCallback((pointerX, pointerY, force = false) => {
    const el = buttonRef.current
    if (!el) return

    const rect = el.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const dx = centerX - pointerX
    const dy = centerY - pointerY
    const distance = Math.max(1, Math.hypot(dx, dy))
    const proximity = Math.max(0, 1 - distance / DANGER_RADIUS)
    intensityRef.current = proximity

    if (!force && distance > DANGER_RADIUS) return

    const bounds = getSafeBounds()
    let dirX = dx / distance
    let dirY = dy / distance

    if (force && Math.abs(dirX) + Math.abs(dirY) < 0.05) {
      const angle = Math.random() * Math.PI * 2
      dirX = Math.cos(angle)
      dirY = Math.sin(angle)
    }

    const strength = MOVE_DISTANCE + proximity * 110
    let nextX = rect.left + dirX * strength
    let nextY = rect.top + dirY * strength

    // If movement would push into an edge, bias it diagonally toward available space.
    if (nextX <= bounds.minX + 8 || nextX >= bounds.maxX - 8) {
      const verticalEscape = pointerY < window.innerHeight / 2 ? 1 : -1
      nextY += verticalEscape * 120
    }
    if (nextY <= bounds.minY + 8 || nextY >= bounds.maxY - 8) {
      const horizontalEscape = pointerX < window.innerWidth / 2 ? 1 : -1
      nextX += horizontalEscape * 120
    }

    nextX = clamp(nextX, bounds.minX, bounds.maxX)
    nextY = clamp(nextY, bounds.minY, bounds.maxY)

    setPosition({ x: nextX, y: nextY })
    setIsChasing(true)
    startChaseSound(() => intensityRef.current)
  }, [getSafeBounds])

  useEffect(() => {
    const onPointerMove = (event) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      if (rafRef.current) return
      rafRef.current = requestAnimationFrame(() => {
        evade(pointerRef.current.x, pointerRef.current.y)
        rafRef.current = null
      })
    }

    window.addEventListener('pointermove', onPointerMove, { passive: true })
    return () => window.removeEventListener('pointermove', onPointerMove)
  }, [evade])

  useEffect(() => {
    if (!isChasing) return
    const stopTimer = window.setTimeout(() => {
      setIsChasing(false)
      intensityRef.current = 0
      stopChaseSound()
    }, 900)
    return () => window.clearTimeout(stopTimer)
  }, [position, isChasing])

  const prevent = (event) => {
    event.preventDefault()
    event.stopPropagation()
    const rect = buttonRef.current?.getBoundingClientRect()
    if (rect) evade(rect.left + rect.width / 2, rect.top + rect.height / 2, true)
  }

  return (
    <button
      ref={buttonRef}
      type="button"
      className={`runaway-button ${isChasing ? 'is-chasing' : ''}`}
      style={position ? { left: position.x, top: position.y } : { visibility: 'hidden' }}
      onPointerEnter={(e) => evade(e.clientX, e.clientY, true)}
      onPointerDown={prevent}
      onClick={prevent}
      onFocus={(e) => {
        e.currentTarget.blur()
        const rect = e.currentTarget.getBoundingClientRect()
        evade(rect.left + rect.width / 2, rect.top + rect.height / 2, true)
      }}
      onKeyDown={prevent}
      aria-label="Click here if you hate me — this button is playfully impossible to click"
    >
      <span>{isChasing ? 'nope nope nope 😝' : 'Click here if you hate me'}</span>
    </button>
  )
}
