# Meghdoot Logistics & Infra — OSH India 2026

A 56-second 4:5 (1080×1350, 30 fps) social video, built with [Remotion](https://www.remotion.dev/).

## Structure

| Time | Scene |
|---|---|
| 0–4s | Logo reveal with swoosh streaks |
| 4–8s | Title: *Exploring Safer Tomorrows* · OSH India 2026 · Goregaon, Mumbai |
| 8–16s | Arriving at the exhibition |
| 16–22s | Team card: Rahul Purohit, Raju Sahu, Suresh Sharma, Dayanand Dhali |
| 22–26s | Triptych: Heavy lifting · Specialized transport · Work at height |
| 26–32s | Safety gear montage (cuts every beat pair) |
| 32–48s | Conversations at the booths |
| 48–52s | Closing line |
| 52–56s | End card with hashtags |

Cuts follow the music's beat grid (120 BPM → 15 frames per beat, 60 per bar).
Transitions: brand-colour swoosh wipe, vertical shutter, diagonal slice, iris, whip pan, zoom-through, push and flash.

## Commands

```bash
npm install
npm run studio   # preview & tweak in the browser
npm run render   # writes out/meghdoot-osh-india-2026.mp4
```

In a sandbox without Remotion's own Chrome download, point it at a local headless Chromium:
`REMOTION_BROWSER=/path/to/headless_shell npm run render`.

## Assets

- `export/meghdoot-osh-india-2026.mp4` — final rendered video (CRF 20, ready to post).
- `public/photos/` — 27 relevant photos chosen from the 39 supplied (near-duplicates dropped), lightly sharpened.
- `public/logo.png` — Meghdoot logo (transparent).
- `public/audio/inspired.mp3` — "Inspired" by Kevin MacLeod (incompetech.com), licensed CC BY 4.0. **Credit is required wherever the video is posted** — see `CAPTION.md`.
- `public/audio/whoosh*.wav`, `boom.wav` — transition sound effects synthesised for this project.
- Fonts: Inter / Inter Display (SIL Open Font License).
