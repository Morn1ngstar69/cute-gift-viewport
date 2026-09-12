let audioContext
let chaseTimer = null
let chaseStep = 0

const getContext = () => {
  if (!audioContext) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return null
    audioContext = new AudioCtx()
  }
  return audioContext
}

const safeResume = async (ctx) => {
  try {
    if (ctx?.state === 'suspended') await ctx.resume()
  } catch {
    // Audio is optional; visuals remain fully functional.
  }
}

const tone = (ctx, frequency, start, duration, type = 'sine', gainValue = 0.04) => {
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(frequency, start)
  gain.gain.setValueAtTime(0.0001, start)
  gain.gain.exponentialRampToValueAtTime(gainValue, start + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(ctx.destination)
  osc.start(start)
  osc.stop(start + duration + 0.02)
}

export async function playCelebration() {
  try {
    const ctx = getContext()
    if (!ctx) return false
    await safeResume(ctx)
    const now = ctx.currentTime
    ;[
      [523.25, 0],
      [659.25, 0.08],
      [783.99, 0.16],
      [1046.5, 0.26]
    ].forEach(([f, delay], index) => tone(ctx, f, now + delay, 0.18, index % 2 ? 'triangle' : 'sine', 0.045))
    return true
  } catch {
    return false
  }
}

export async function startChaseSound(getIntensity = () => 0.5) {
  if (chaseTimer) return
  try {
    const ctx = getContext()
    if (!ctx) return
    await safeResume(ctx)

    chaseTimer = window.setInterval(() => {
      try {
        const intensity = Math.max(0, Math.min(1, getIntensity()))
        const now = ctx.currentTime
        const scale = [196, 220, 246.94, 293.66, 329.63]
        const base = scale[chaseStep % scale.length]
        const frequency = base * (1 + intensity * 0.45)
        const duration = 0.07 + intensity * 0.03
        tone(ctx, frequency, now, duration, chaseStep % 2 ? 'square' : 'triangle', 0.012 + intensity * 0.01)
        chaseStep += 1
      } catch {
        stopChaseSound()
      }
    }, 155)
  } catch {
    stopChaseSound()
  }
}

export function stopChaseSound() {
  if (chaseTimer) {
    window.clearInterval(chaseTimer)
    chaseTimer = null
  }
}
