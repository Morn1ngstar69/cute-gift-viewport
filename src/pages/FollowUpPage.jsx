import React from 'react'
import AmbientDecor from '../components/AmbientDecor.jsx'

export default function FollowUpPage() {
  return (
    <main className="page page-two">
      <AmbientDecor />
      <section className="heart-card followup-card" aria-labelledby="missing-title">
        <div className="envelope" aria-hidden="true">
          <div className="envelope-heart">💌</div>
        </div>
        <div className="tiny-kicker">okay… since you clicked it 💗</div>
        <h1 id="missing-title">I missed you more than I expected.</h1>
        <p className="lead-copy">
          There was this strange little emptiness in the day because you weren’t there in the way I’m used to. I kept wondering what you were doing, whether you were smiling, whether you were resting properly, and whether something small had made your day a little better.
        </p>
        <p>
          Your absence made me realise how quietly you have become part of my everyday life. It’s in the tiny things — the thought of telling you something the moment it happens, wanting to hear your reaction, waiting for your presence without even noticing that I’m waiting.
        </p>
        <p>
          I hope your little vacation from the world gave you the space you needed. But I also hope you don’t disappear like that too often, because when you do, everything feels slightly out of place. I can go through the day, of course… it just doesn’t feel completely like mine when you’re missing from it.
        </p>
        <p className="closing-copy">
          So yes, this is me being a little vulnerable: I missed you. A lot. And having you back feels a little like my heart returning to where it belongs. 💞
        </p>
        <button className="back-button" type="button" onClick={() => { window.location.hash = '' }}>
          ← read the first note again
        </button>
      </section>
    </main>
  )
}
