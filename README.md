# Kevin O Matos · portfolio

**Live:** [comply.website/kevin](https://comply.website/kevin)

Full stack & AI engineer, relocating to Dublin in January 2027. This is the source of my portfolio, built from scratch.

## Stack

- **React 18 + Vite 5**, no meta-framework: it's one page, so no server is needed
- **Tailwind CSS 4** with design tokens in `src/index.css` (black, silver and gold)
- **Motion** for animation, with `MotionConfig reducedMotion="user"` so the effects switch off for people who ask their OS for less motion
- **Vercel** hosting under base `/kevin/`, served on `comply.website/kevin` through a small proxy in my studio's Node server
- **Vercel Analytics**, proxied through the same server

## Things worth looking at

| What | Where |
|---|---|
| ⌘K command palette | `CommandPalette` in `src/App.jsx` |
| Project pages with shareable URLs (`#project/avodah`) | `useHashProject`, `DeepDive` |
| Videos that never flash: the poster is the video's own first frame, it preloads one screen early and only plays while visible | `LazyVideo` |
| Particle field capped at ~30 fps, paused in background tabs, no canvas shadows | `Particles` |
| All content as data, separate from layout | `src/data.js` |

## Performance notes

Things I removed after profiling in Safari: JS smooth scrolling (native scroll is smoother), large `filter: blur()` glows (replaced by pre-baked radial gradients), blur in entrance animations, full-screen repaints for the cursor glow (now a transformed blob) and an always-spinning conic border (it runs on hover only).

Screenshots are compressed JPEGs. The product videos were recorded with Puppeteer and encoded with ffmpeg (H.264, `+faststart`).

## Run it

```bash
npm install
npm run dev      # http://localhost:5173/kevin/
npx vite build   # outputs to dist/kevin
```
