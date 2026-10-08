import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {C, CARD, TOTAL_FRAMES, photo} from './theme';
import {CardCaption, CardShot, Closing, EndCard, LogoIntro, PhotoSection, TeamScene, TitleScene, Triptych} from './components/Scenes';
import {Flash, InType, OutType, Shot, ShutterWipe, SwooshWipe} from './components/Transitions';

type Enter = InType | 'swoosh' | 'shutter' | 'flash';
type SectionDef = {
  cut: number;
  enter: Enter;
  T: number;
  el: (lead: number) => React.ReactNode;
  origin?: [number, number];
  // Shot cuts inside the section's photo card (relative to the section cut) — for sound effects.
  innerCuts?: {at: number; T: number}[];
};

const ARRIVAL: CardShot[] = [
  {at: 0, enter: 'cut', T: 0, pic: {n: photo(22), pan: [30, 62], fy: 50}},
  {at: 60, enter: 'whip', T: 14, pic: {n: photo(28), fy: 42}},
  {at: 120, enter: 'zoom', T: 14, pic: {n: photo(1), pan: [55, 25], fy: 50}},
  {at: 180, enter: 'iris', T: 18, pic: {n: photo(3), fy: 32, zoom: [1.12, 1.03]}},
];
const ARRIVAL_CAPTIONS: CardCaption[] = [
  {from: 8, to: 116, label: 'OSH India 2026 · Mumbai', text: 'A glimpse of Team Meghdoot at OSH India', accent: {Meghdoot: C.orange}},
  {from: 124, to: 238, label: 'Occupational safety & health', text: 'Exploring the latest in workplace safety', accent: {safety: C.blue}},
];

const GEAR: CardShot[] = [
  {at: 0, enter: 'cut', T: 0, pic: {n: photo(11), fy: 28}},
  {at: 30, enter: 'whip', T: 10, pic: {n: photo(6), pan: [20, 45], fy: 40}},
  {at: 60, enter: 'zoom', T: 10, pic: {n: photo(2), fy: 40}},
  {at: 90, enter: 'slice', T: 10, pic: {n: photo(23), pan: [35, 70], fy: 50}},
  {at: 120, enter: 'whip', T: 10, pic: {n: photo(36), fy: 38}},
  {at: 150, enter: 'push', T: 10, pic: {n: photo(32), fy: 42}},
];
const GEAR_CAPTIONS: CardCaption[] = [
  {from: 8, to: 180, label: 'Staying informed', text: 'Evolving safety practices & technologies', accent: {safety: C.orange}},
];

const BOOTHS: CardShot[] = [
  {at: 0, enter: 'cut', T: 0, pic: {n: photo(4), pan: [40, 70], fy: 45}},
  {at: 60, enter: 'slice', T: 16, pic: {n: photo(19), pan: [70, 45], fy: 50}},
  {at: 120, enter: 'whip', T: 14, pic: {n: photo(26), fy: 40}},
  {at: 180, enter: 'zoom', T: 14, pic: {n: photo(34), fy: 45}},
  {at: 240, enter: 'push', T: 16, pic: {n: photo(27), pan: [30, 60], fy: 45}},
  {at: 300, enter: 'whip', T: 14, pic: {n: photo(17), fy: 38}},
  {at: 360, enter: 'iris', T: 16, pic: {n: photo(38), fy: 40}},
  {at: 420, enter: 'zoom', T: 14, pic: {n: photo(30), pan: [25, 55], fy: 50}},
];
const BOOTH_CAPTIONS: CardCaption[] = [
  {from: 8, to: 116, label: 'At the exhibition', text: 'Exploring new ideas & innovations', accent: {ideas: C.orange}},
  {from: 124, to: 296, label: 'Conversations', text: 'Connecting with industry professionals', accent: {industry: C.blue}},
  {from: 304, to: 476, label: 'Taking it to site', text: 'Insights for safer, more efficient project execution', size: 50, accent: {safer: C.orange}},
];

const inner = (shots: CardShot[]) => shots.slice(1).map((s) => ({at: s.at, T: s.T}));

// Cuts sit on the music's beat grid (15 frames per beat, 60 per bar);
// phrase changes in the track land at 480, 960 and 1440.
const SECTIONS: SectionDef[] = [
  {cut: 0, enter: 'cut', T: 0, el: () => <LogoIntro />},
  {cut: 120, enter: 'swoosh', T: 28, el: () => <TitleScene />},
  {cut: 240, enter: 'slice', T: 16, el: (lead) => <PhotoSection shots={ARRIVAL} captions={ARRIVAL_CAPTIONS} lead={lead} />, innerCuts: inner(ARRIVAL)},
  {cut: 480, enter: 'shutter', T: 24, el: () => <TeamScene />},
  {cut: 660, enter: 'flash', T: 14, el: () => <Triptych />},
  {
    cut: 780,
    enter: 'iris',
    T: 16,
    origin: [CARD.x + CARD.w / 2, CARD.y + 330],
    el: (lead) => <PhotoSection shots={GEAR} captions={GEAR_CAPTIONS} lead={lead} />,
    innerCuts: inner(GEAR),
  },
  {cut: 960, enter: 'swoosh', T: 28, el: (lead) => <PhotoSection shots={BOOTHS} captions={BOOTH_CAPTIONS} lead={lead} />, innerCuts: inner(BOOTHS)},
  {cut: 1440, enter: 'shutter', T: 24, el: () => <Closing />},
  {cut: 1560, enter: 'iris', T: 22, el: () => <EndCard />},
];

const isCover = (e: Enter) => e === 'swoosh' || e === 'shutter';
const leadOf = (s: SectionDef) => (isCover(s.enter) ? 0 : Math.floor(s.T / 2));
const inType = (e: Enter): InType => (e === 'flash' ? 'zoom' : isCover(e) ? 'cut' : e);
const outType = (e: Enter): OutType =>
  e === 'whip' || e === 'zoom' || e === 'push' ? e : e === 'flash' ? 'zoom' : 'none';

const WHOOSH_PEAK = 11; // frames into whoosh.wav where it is loudest
const SHORT_PEAK = 6;
const BOOMS = [14, 480, 660, 1440, 1560];

export const MeghdootOSH: React.FC = () => {
  const whooshes: {f: number; short: boolean}[] = [];
  for (const s of SECTIONS.slice(1)) {
    whooshes.push({f: s.cut, short: false});
    for (const c of s.innerCuts ?? []) whooshes.push({f: s.cut + c.at, short: c.T <= 10});
  }
  return (
    <AbsoluteFill style={{backgroundColor: C.light}}>
      {SECTIONS.map((s, i) => {
        const next = SECTIONS[i + 1];
        const lead = leadOf(s);
        const from = s.cut - lead;
        const end = next ? next.cut + (isCover(next.enter) ? 0 : Math.ceil(next.T / 2)) : TOTAL_FRAMES;
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Section @${s.cut}`}>
            <Shot
              enter={inType(s.enter)}
              enterT={isCover(s.enter) ? 0 : s.T}
              exit={next ? outType(next.enter) : 'none'}
              exitT={next && !isCover(next.enter) ? next.T : 0}
              origin={s.origin}
            >
              {s.el(lead)}
            </Shot>
          </Sequence>
        );
      })}

      {SECTIONS.filter((s) => isCover(s.enter) || s.enter === 'flash').map((s) => (
        <Sequence key={`ov${s.cut}`} from={s.cut - Math.floor(s.T / 2)} durationInFrames={s.T + 12} name={`${s.enter} @${s.cut}`}>
          {s.enter === 'swoosh' ? <SwooshWipe T={s.T} /> : s.enter === 'shutter' ? <ShutterWipe T={s.T} /> : <Flash T={s.T} />}
        </Sequence>
      ))}

      <Audio
        src={staticFile('audio/inspired.mp3')}
        volume={(f) => interpolate(f, [0, 6, TOTAL_FRAMES - 90, TOTAL_FRAMES - 4], [0, 0.78, 0.78, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {whooshes.map(({f, short}) => (
        <Sequence key={`sfx${f}`} from={f - (short ? SHORT_PEAK : WHOOSH_PEAK)} durationInFrames={30} name="whoosh">
          <Audio src={staticFile(short ? 'audio/whoosh_short.wav' : 'audio/whoosh.wav')} volume={short ? 0.16 : 0.26} />
        </Sequence>
      ))}
      <Sequence from={4} durationInFrames={30} name="intro whoosh">
        <Audio src={staticFile('audio/whoosh.wav')} volume={0.22} />
      </Sequence>
      {BOOMS.map((f) => (
        <Sequence key={`boom${f}`} from={f} durationInFrames={66} name="boom">
          <Audio src={staticFile('audio/boom.wav')} volume={0.32} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
