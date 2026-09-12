import React from 'react'

export default function Confetti({ active }) {
  if (!active) return null

  const pieces = Array.from({ length: 42 }, (_, i) => ({
    id: i,
    left: (i * 37) % 100,
    delay: (i % 9) * 0.035,
    drift: ((i % 7) - 3) * 18,
    symbol: ['💗', '✨', '🌸', '💖', '⭐'][i % 5]
  }))

  return (
    <div className="confetti-layer" aria-hidden="true">
      {pieces.map((piece) => (
        <span
          key={piece.id}
          className="confetti-piece"
          style={{
            left: `${piece.left}%`,
            animationDelay: `${piece.delay}s`,
            '--drift': `${piece.drift}px`
          }}
        >
          {piece.symbol}
        </span>
      ))}
    </div>
  )
}
