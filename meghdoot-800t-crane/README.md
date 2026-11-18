# Meghdoot Infra — 800 Ton Crane Transportation (Jamnagar → Badnawar)

A 52-second 4:5 (1080×1350, 30 fps) social video, built with [Remotion](https://www.remotion.dev/).
Same light brand system as `../meghdoot-osh-india-2026` (#F1682B / #0585C3 on #F4F4F6).

## Structure

| Time | Scene |
|---|---|
| 0–4s | Logo reveal |
| 4–8s | Title: **800 TON** Crane Transportation · Jamnagar → Badnawar |
| 8–16s | Animated route map: Jamnagar, Gujarat → Badnawar, Madhya Pradesh (schematic, not to scale) |
| 16–24s | The load: crane body, boom, crawler tracks, lattice sections |
| 24–28s | Triptych: Planned. Secured. On the move. |
| 28–32s | Fleet quick cuts |
| 32–44s | On site and on the move |
| 44–48s | Closing line: *Moving infrastructure on wheels.* |
| 48–52s | End card with hashtags |

## Commands

```bash
npm install
npm run studio   # preview & tweak
npm run render   # writes out/meghdoot-800t-crane.mp4
```

Point Remotion at a local headless Chromium if it cannot download its own:
`REMOTION_BROWSER=/path/to/chrome-headless-shell npm run render`.

## Assets

- `export/meghdoot-800t-crane.mp4` — final video (CRF 20, ready to post).
- `public/photos/` — 20 photos chosen from the 27 supplied (near-duplicates and the WhatsApp collage left out).
- `public/audio/inspired.mp3` — "Inspired" by Kevin MacLeod (incompetech.com), CC BY 4.0, from 1:04 so it differs from the OSH video. **Credit required** — see `CAPTION.md`.
- `public/audio/whoosh*.wav`, `boom.wav` — synthesised transition effects.
