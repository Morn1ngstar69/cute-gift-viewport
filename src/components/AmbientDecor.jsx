import React from 'react'

export default function AmbientDecor() {
  const items = ['♡', '✦', '♡', '✿', '✧', '♡', '✦', '♡', '✿', '✧', '♡', '✦']
  return (
    <div className="ambient" aria-hidden="true">
      {items.map((item, i) => (
        <span
          key={`${item}-${i}`}
          className={`ambient-item ambient-${i + 1}`}
        >
          {item}
        </span>
      ))}
    </div>
  )
}
