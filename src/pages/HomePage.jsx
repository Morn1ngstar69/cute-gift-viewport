import React, { useState } from 'react'
import AmbientDecor from '../components/AmbientDecor.jsx'
import Confetti from '../components/Confetti.jsx'
import RunawayButton from '../components/RunawayButton.jsx'
import { playCelebration, stopChaseSound } from '../components/AudioEngine.js'

export default function HomePage({ onContinue }) {
  const [celebrating, setCelebrating] = useState(false)

  const handleMissingClick = async () => {
    stopChaseSound()
    setCelebrating(true)
    await playCelebration()
    window.setTimeout(onContinue, 900)
  }

  return (
    <main className="page page-one">
      <AmbientDecor />
      <Confetti active={celebrating} />

      <section className="heart-card intro-card" aria-labelledby="support-title">
        <div className="tiny-kicker">for the person who means more than they know ✨</div>
        <div className="heart-orbit" aria-hidden="true"><span>💗</span></div>
        <h1 id="support-title">Hey beautiful,</h1>
        <p className="lead-copy">
          I know today asked more from you than it should have. Maybe you had to keep smiling when you were tired, stay strong when you really wanted to disappear for a little while, or carry thoughts that felt heavier than anyone around you could see.
        </p>
        <p>
          I just want you to know that I see how hard you try. I care about the quiet battles too - the ones you don’t always talk about. You are allowed to feel tired, overwhelmed, or fragile. None of that takes away from the strength inside you.
        </p>
        <p>
          You have already survived so many difficult moments, and somehow you still keep choosing to move forward. That resilience is one of the most beautiful things about you. So tonight, please be gentle with yourself. You don’t have to solve everything at once. Just breathe, rest a little, and remember that someone is genuinely rooting for you. 💕
        </p>

        <div className="button-zone">
          <button className="missing-button" type="button" onClick={handleMissingClick}>
            <span className="button-heart">♥</span>
            Click here if you were missing me
          </button>
          <div className="runaway-placeholder" aria-hidden="true">and absolutely do not try the other one 😌</div>
        </div>
      </section>

      <RunawayButton />
    </main>
  )
}
