# "The Map That Stopped a Plague": shot-by-shot prompts

A ~40 s vertical (9:16, 1080x1920, 30 fps) explainer in the same style as the reference: AI-generated stills, each with a slow camera move, graph-paper and newspaper textures, bold serif kinetic type, and a documentary voiceover. The story is different from the reference: Dr. John Snow and the 1854 Broad Street cholera outbreak.

## How to use this
1. Generate each **IMAGE PROMPT** in an image model (9:16). Generate 2–4 variations and keep the best.
2. Animate each image with the **MOTION PROMPT** in an image-to-video model (3–5 s clips). A cheaper option is to do the camera move yourself in an editor (slow zoom or pan).
3. Lay the voiceover underneath, cut on the sentence breaks, and add the on-screen text in an editor (CapCut, Premiere, etc.).
4. Add low ambient music (a slow, tense pad) with a soft whoosh at each cut.

**Global style block.** Paste this at the end of every image prompt so the shots look like one film:
> cinematic editorial illustration, hyper-detailed, soft volumetric light, subtle film grain, muted Victorian palette with deep red accents, shallow depth of field, vertical 9:16 composition, no text, no watermark

**Accuracy note.** Keep the facts as written below. Snow's map, the pump handle removal, and his death in 1858 are well documented. Snow himself did not live to see germ theory accepted.

---

## Voiceover script (~38 s at a calm documentary pace)

| # | Line | Approx. time |
|---|---|---|
| V1 | In 1854, cholera tore through London. | 0:00–0:03 |
| V2 | Hundreds died in a matter of days. | 0:03–0:06 |
| V3 | The experts blamed bad air. | 0:06–0:09 |
| V4 | One doctor, John Snow, didn't believe it. | 0:09–0:13 |
| V5 | So he stopped guessing… and started counting. | 0:13–0:17 |
| V6 | Every death, marked on a map. | 0:17–0:20 |
| V7 | The dots clustered around a single place: a water pump on Broad Street. | 0:20–0:26 |
| V8 | He asked the council to remove the handle. They did. | 0:26–0:30 |
| V9 | And the outbreak faded. | 0:30–0:32 |
| V10 | Snow never lived to see his idea accepted. | 0:32–0:35 |
| V11 | But the habit he started, following the evidence, still protects millions of people today. | 0:35–0:41 |

A voiceover of this script was already started in ElevenLabs (voice "Spartan – Deep Narration & Storytelling", model eleven_v4, flow `dp1CciF1q3kvF77F02Kw`). Open it in your ElevenLabs account to download the take, or regenerate it there.

---

## Shots

### Shot 1: Night over Soho (V1, 0:00–0:03)
- **IMAGE PROMPT:** Wide establishing shot of a dark, foggy Victorian London street at night in 1854, crowded brick townhouses with gas lamps, a few upstairs windows glowing deep red, a single horse-drawn cart in the lower foreground, wet cobblestones reflecting the light, ominous storm clouds above. [global style block]
- **MOTION PROMPT:** Slow push-in down the street, fog drifting across the frame, gas lamps flickering, red windows pulsing very slightly.
- **ON-SCREEN TEXT:** "LONDON, 1854" (heavy serif, white, slams in at 0:00.5). Small line beneath: "SOHO".

### Shot 2: The toll (V2, 0:03–0:06)
- **IMAGE PROMPT:** Close, low-angle view of a row of Victorian doors, each marked with a small chalk cross, a lone figure in a long coat walking away down the empty street, cold blue-grey fog with red lamp glow. [global style block]
- **MOTION PROMPT:** Slow tracking shot sideways along the doors; the figure keeps walking into the fog.
- **ON-SCREEN TEXT:** Counter ticking up from 0 to "600+" with the label "DEATHS".

### Shot 3: Bad air (V3, 0:06–0:09)
- **IMAGE PROMPT:** Thick sickly green-yellow fog rolling through a Victorian alley, a gas lamp barely visible, a man in a top hat covering his nose and mouth with a handkerchief, murky and unsettling. [global style block]
- **MOTION PROMPT:** Fog swirls and drifts toward the camera; slow zoom on the man.
- **ON-SCREEN TEXT:** "BAD AIR" stamped in red like a rubber stamp, with "THE MIASMA THEORY" in small type underneath.

### Shot 4: Dr. John Snow (V4, 0:09–0:13)
- **IMAGE PROMPT:** Formal portrait of a Victorian physician in his 40s, clean-shaven with side-parted dark hair, dark frock coat and high white collar, calm and thoughtful expression, framed like an old photograph with a white border, placed on a pale blue-grey background. [global style block]
- **MOTION PROMPT:** The photo drifts in with a slight rotation; subtle parallax with the background.
- **ON-SCREEN TEXT:** "DR. JOHN SNOW" (heavy serif), below it "Physician, London".

### Shot 5: Counting (V5, 0:13–0:17)
- **IMAGE PROMPT:** Top-down view of a physician's desk covered in graph paper, an open ledger of handwritten tally marks, a quill pen, an inkwell, a brass magnifying glass, warm lamplight from the side. [global style block]
- **MOTION PROMPT:** Slow overhead push-in; the pen draws tally marks in the ledger.
- **ON-SCREEN TEXT:** "guessing" appears, then a hand-drawn line strikes it out; then "COUNTING" appears in bold.

### Shot 6: The map (V6, 0:17–0:20)
- **IMAGE PROMPT:** A large antique hand-drawn map of London's Soho district on aged paper with graph-paper grid lines, narrow streets and the Thames at the bottom, small black ink bars stacked at several house locations, lamplit desk edge visible in the corner. [global style block]
- **MOTION PROMPT:** Camera glides across the map as new black bars appear one by one.
- **ON-SCREEN TEXT:** "EVERY DEATH, MARKED." (small caps, top of frame).

### Shot 7: The pump (V7, 0:20–0:26)
- **IMAGE PROMPT:** Close-up of the same antique map where the ink bars form a tight cluster around one point, a red circle drawn around a street labelled "Broad St" with a small pump symbol, slight chalk dust. [global style block, but keep the label readable or add it later in editing]
- **MOTION PROMPT:** Fast zoom into the red circle; the cluster pulses once.
- **ON-SCREEN TEXT:** "BROAD STREET PUMP" with an arrow pointing to the circle.
- **CUTAWAY (optional, 0:24–0:26):** A cast-iron water pump on a cobbled street, crowds of people with buckets around it, dusk light.

### Shot 8: Remove the handle (V8, 0:26–0:30)
- **IMAGE PROMPT:** Two men in Victorian clothes lifting the long iron handle off a street water pump, a small crowd watching, cobblestones, early-morning grey light, the pump now useless and handleless. [global style block]
- **MOTION PROMPT:** The handle lifts off and is carried away; slow zoom on the empty pump.
- **ON-SCREEN TEXT:** "SEPTEMBER 1854" (small, bottom-left).

### Shot 9: It fades (V9, 0:30–0:32)
- **IMAGE PROMPT:** A blackboard-style chart in a wooden frame lying on an old desk, a chalk line starting high on the left and falling steadily to near zero on the right, hand-drawn axes labelled "Days" and "Deaths", chalk dust. [global style block]
- **MOTION PROMPT:** The chalk line draws itself from left to right as the camera pushes in.
- **ON-SCREEN TEXT:** "THE OUTBREAK FADED".

### Shot 10: Never saw it (V10, 0:32–0:35)
- **IMAGE PROMPT:** A single beam of cold light from above onto a bare pale graph-paper wall, an empty wooden chair below, one old framed portrait on the wall fading into shadow. [global style block]
- **MOTION PROMPT:** Slow pull-back; the spotlight narrows.
- **ON-SCREEN TEXT:** "1813 – 1858" in large serif type, then below it: "He never saw it accepted."

### Shot 11: The habit (V11, 0:35–0:41)
- **IMAGE PROMPT:** A modern public-health scene: a masked epidemiologist and a team looking at a glowing wall map of a city covered in small coloured dots, soft clean light, a hopeful tone; or a bright clean flat-lay of a pen, notebook and map on a white desk. [global style block, brighter palette]
- **MOTION PROMPT:** Gentle push-in; the dots on the wall map flicker as data updates.
- **ON-SCREEN TEXT:** Stacked kinetic type, red and black: "FOLLOW / THE / EVIDENCE." Hold for the last second.

---

## Assembly checklist
- [ ] Voiceover downloaded and placed on the timeline first; cut each shot to its line.
- [ ] Each image generated at 9:16 and animated to 3–5 s.
- [ ] On-screen text added in an editor (generators misspell text, so avoid asking them to render it).
- [ ] Ambient music at about -20 dB under the voice, whoosh on each cut.
- [ ] Export 1080x1920, 30 fps, H.264, loudness about -14 LUFS.
