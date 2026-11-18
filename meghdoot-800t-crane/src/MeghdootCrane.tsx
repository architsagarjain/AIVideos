import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {C, CARD, TOTAL_FRAMES, photo} from './theme';
import {CardCaption, CardShot, Closing, EndCard, LogoIntro, PhotoSection, TitleScene, Triptych} from './components/Scenes';
import {RouteMap} from './components/RouteMap';
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

const LOAD: CardShot[] = [
  {at: 0, enter: 'cut', T: 0, pic: {n: photo(7), pan: [40, 60], fy: 50}},
  {at: 60, enter: 'whip', T: 14, pic: {n: photo(8), pan: [70, 40], fy: 45}},
  {at: 120, enter: 'zoom', T: 14, pic: {n: photo(9), pan: [30, 60], fy: 55}},
  {at: 180, enter: 'iris', T: 18, pic: {n: photo(14), fx: 50, fy: 55, zoom: [1.12, 1.03]}},
];
const LOAD_CAPTIONS: CardCaption[] = [
  {from: 8, to: 116, label: 'The load', text: 'An 800 ton crane, moved in sections', accent: {'800': C.orange}},
  {from: 124, to: 238, label: 'Heavy haulage', text: 'Each component secured on specialised trailers', size: 52, accent: {specialised: C.blue}},
];

const FLEET: CardShot[] = [
  {at: 0, enter: 'cut', T: 0, pic: {n: photo(1), fx: 62, fy: 55}},
  {at: 30, enter: 'whip', T: 10, pic: {n: photo(2), fx: 40, fy: 50}},
  {at: 60, enter: 'zoom', T: 10, pic: {n: photo(26), fx: 50, fy: 55}},
  {at: 90, enter: 'slice', T: 10, pic: {n: photo(17), pan: [30, 55], fy: 50}},
];
const FLEET_CAPTIONS: CardCaption[] = [
  {from: 8, to: 120, label: 'Our fleet', text: 'The Meghdoot fleet, ready to roll', accent: {Meghdoot: C.orange}},
];

const JOURNEY: CardShot[] = [
  {at: 0, enter: 'cut', T: 0, pic: {n: photo(12), pan: [35, 60], fy: 55}},
  {at: 60, enter: 'slice', T: 16, pic: {n: photo(3), fx: 55, fy: 50}},
  {at: 120, enter: 'whip', T: 14, pic: {n: photo(11), pan: [20, 50], fy: 55}},
  {at: 180, enter: 'zoom', T: 14, pic: {n: photo(21), fx: 45, fy: 55}},
  {at: 240, enter: 'push', T: 16, pic: {n: photo(23), fx: 60, fy: 55}},
  {at: 300, enter: 'iris', T: 16, pic: {n: photo(22), pan: [55, 35], fy: 45}},
];
const JOURNEY_CAPTIONS: CardCaption[] = [
  {from: 8, to: 176, label: 'On site', text: 'Coordinated loading and dispatch', accent: {dispatch: C.orange}},
  {from: 184, to: 356, label: 'Madhya Pradesh', text: 'Supporting the move, every step of the way', accent: {step: C.blue}},
];

const inner = (shots: CardShot[]) => shots.slice(1).map((s) => ({at: s.at, T: s.T}));

// Cuts sit on the music's beat grid (15 frames per beat, 60 per bar);
// phrase changes in the track land at 480, 960 and 1440.
const SECTIONS: SectionDef[] = [
  {cut: 0, enter: 'cut', T: 0, el: () => <LogoIntro />},
  {cut: 120, enter: 'swoosh', T: 28, el: () => <TitleScene />},
  {cut: 240, enter: 'slice', T: 16, el: () => <RouteMap />},
  {cut: 480, enter: 'shutter', T: 24, el: () => <PhotoSection shots={LOAD} captions={LOAD_CAPTIONS} />, innerCuts: inner(LOAD)},
  {cut: 720, enter: 'flash', T: 14, el: () => <Triptych />},
  {
    cut: 840,
    enter: 'iris',
    T: 16,
    origin: [CARD.x + CARD.w / 2, CARD.y + 400],
    el: (lead) => <PhotoSection shots={FLEET} captions={FLEET_CAPTIONS} lead={lead} />,
    innerCuts: inner(FLEET),
  },
  {cut: 960, enter: 'swoosh', T: 28, el: (lead) => <PhotoSection shots={JOURNEY} captions={JOURNEY_CAPTIONS} lead={lead} />, innerCuts: inner(JOURNEY)},
  {cut: 1320, enter: 'shutter', T: 24, el: () => <Closing />},
  {cut: 1440, enter: 'iris', T: 22, el: () => <EndCard />},
];

const isCover = (e: Enter) => e === 'swoosh' || e === 'shutter';
const leadOf = (s: SectionDef) => (isCover(s.enter) ? 0 : Math.floor(s.T / 2));
const inType = (e: Enter): InType => (e === 'flash' ? 'zoom' : isCover(e) ? 'cut' : e);
const outType = (e: Enter): OutType =>
  e === 'whip' || e === 'zoom' || e === 'push' ? e : e === 'flash' ? 'zoom' : 'none';

const WHOOSH_PEAK = 11; // frames into whoosh.wav where it is loudest
const SHORT_PEAK = 6;
const BOOMS = [14, 480, 720, 1320, 1440];

export const MeghdootCrane: React.FC = () => {
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
