# Cute Gift Website — React 19

A lightweight, production-ready Vite + React 19 gift site with a viewport-wide impossible-to-click chase button, generated audio effects, confetti, responsive styling, and lazy-loaded second page.

## Run locally

```bash
npm install
npm run dev
```

Open the local URL shown by Vite.

## Production build

```bash
npm run build
npm run preview
```

## Deploy to Vercel

1. Push this folder to GitHub or import it directly into Vercel.
2. Framework preset: **Vite**.
3. Build command: `npm run build`
4. Output directory: `dist`

`vercel.json` already includes the SPA rewrite and immutable caching for Vite assets.

## Important implementation notes

- The chase button uses `position: fixed`, so it moves across the entire visible viewport rather than a local container.
- Movement is clamped using the real rendered button dimensions and a 16px edge safety margin.
- Window resizing re-clamps the button inside the new display size.
- Mouse, pen, touch, focus, keyboard, pointer-down and click activation paths are intercepted.
- Pointer tracking is throttled with `requestAnimationFrame()` to avoid lag.
- Celebration and chase audio are synthesized with the Web Audio API, so there are no MP3/WAV downloads or extra audio libraries.
- Audio failures are non-blocking: animations and navigation still work.
- Page 2 is loaded with `React.lazy()` for code splitting.
- No external fonts, images, or CDNs are required.
