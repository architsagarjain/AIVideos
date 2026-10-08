import React from 'react';
import {AbsoluteFill, Audio, Sequence, interpolate, staticFile} from 'remotion';
import {C, TOTAL_FRAMES, photo} from './theme';
import {LandscapeShot, PortraitShot} from './components/Photo';
import {Closing, EndCard, LogoIntro, TeamScene, TitleScene, Triptych} from './components/Scenes';
import {BrandBug, Caption} from './components/Text';
import {Flash, InType, OutType, Shot, ShutterWipe, SwooshWipe} from './components/Transitions';

type Enter = InType | 'swoosh' | 'shutter' | 'flash';
type ShotDef = {cut: number; enter: Enter; T: number; el: React.ReactNode; origin?: [number, number]};

// Cuts sit on the music's beat grid (15 frames per beat, 60 per bar);
// phrase changes in the track land at 480, 960 and 1440.
const SHOTS: ShotDef[] = [
  {cut: 0, enter: 'cut', T: 0, el: <LogoIntro />},
  {cut: 120, enter: 'swoosh', T: 28, el: <TitleScene />},
  // Arrival
  {cut: 240, enter: 'slice', T: 16, el: <LandscapeShot n={photo(22)} focus="55% 50%" />},
  {cut: 300, enter: 'whip', T: 14, el: <PortraitShot n={photo(28)} focus="50% 40%" kb={{from: 1.05, to: 1.15, y: [10, -10]}} />},
  {cut: 360, enter: 'zoom', T: 14, el: <LandscapeShot n={photo(1)} focus="45% 50%" />},
  {cut: 420, enter: 'iris', T: 18, el: <PortraitShot n={photo(3)} focus="50% 30%" kb={{from: 1.15, to: 1.05}} />},
  // Team
  {cut: 480, enter: 'shutter', T: 24, el: <TeamScene />},
  // Safety at work
  {cut: 660, enter: 'flash', T: 14, el: <Triptych />},
  {cut: 780, enter: 'iris', T: 14, origin: [540, 470], el: <PortraitShot n={photo(11)} focus="50% 30%" kb={{from: 1.04, to: 1.14}} />},
  {cut: 810, enter: 'whip', T: 10, el: <LandscapeShot n={photo(6)} focus="40% 40%" />},
  {cut: 840, enter: 'zoom', T: 10, el: <PortraitShot n={photo(2)} focus="50% 40%" />},
  {cut: 870, enter: 'slice', T: 10, el: <LandscapeShot n={photo(23)} focus="40% 50%" />},
  {cut: 900, enter: 'whip', T: 10, el: <PortraitShot n={photo(36)} focus="50% 40%" />},
  {cut: 930, enter: 'push', T: 10, el: <PortraitShot n={photo(35)} focus="50% 45%" kb={{from: 1.05, to: 1.12}} />},
  // At the exhibition
  {cut: 960, enter: 'swoosh', T: 28, el: <LandscapeShot n={photo(4)} focus="55% 50%" />},
  {cut: 1020, enter: 'slice', T: 16, el: <LandscapeShot n={photo(19)} focus="60% 50%" />},
  {cut: 1080, enter: 'whip', T: 14, el: <PortraitShot n={photo(26)} focus="50% 40%" />},
  {cut: 1140, enter: 'zoom', T: 14, el: <PortraitShot n={photo(34)} focus="50% 45%" />},
  {cut: 1200, enter: 'push', T: 16, el: <LandscapeShot n={photo(27)} focus="50% 50%" />},
  {cut: 1260, enter: 'whip', T: 14, el: <PortraitShot n={photo(17)} focus="50% 40%" />},
  {cut: 1320, enter: 'iris', T: 16, el: <PortraitShot n={photo(38)} focus="50% 40%" />},
  {cut: 1380, enter: 'zoom', T: 14, el: <LandscapeShot n={photo(30)} focus="40% 50%" />},
  // Close
  {cut: 1440, enter: 'shutter', T: 24, el: <Closing />},
  {cut: 1560, enter: 'iris', T: 22, el: <EndCard />},
];

const isCover = (e: Enter) => e === 'swoosh' || e === 'shutter';
const startOf = (s: ShotDef) => (isCover(s.enter) ? s.cut : s.cut - Math.floor(s.T / 2));
const inType = (e: Enter): InType => (e === 'flash' ? 'zoom' : isCover(e) ? 'cut' : e);
const outType = (e: Enter): OutType =>
  e === 'whip' || e === 'zoom' || e === 'push' ? e : e === 'flash' ? 'zoom' : 'none';

const CAPTIONS: {from: number; to: number; label: string; text: string; size?: number; accent?: Record<string, string>}[] = [
  {from: 252, to: 358, label: 'OSH India 2026 · Mumbai', text: 'A glimpse of Team Meghdoot at OSH India'},
  {from: 366, to: 474, label: 'Occupational safety & health', text: 'Exploring the latest in workplace safety', accent: {safety: C.orange}},
  {from: 792, to: 954, label: 'Staying informed', text: 'Evolving safety practices & technologies', accent: {safety: C.orange}},
  {from: 972, to: 1074, label: 'At the exhibition', text: 'Exploring new ideas & innovations', accent: {ideas: C.orange}},
  {from: 1086, to: 1254, label: 'Conversations', text: 'Connecting with industry professionals', accent: {industry: C.orange}},
  {from: 1266, to: 1434, label: 'Taking it to site', text: 'Insights for safer, more efficient project execution', size: 52, accent: {safer: C.orange}},
];

const BUG: [number, number][] = [
  [236, 484],
  [668, 1442],
];

const WHOOSH_PEAK = 11; // frames into whoosh.wav where it is loudest
const SHORT_PEAK = 6;
const BOOMS = [14, 480, 660, 1440, 1560];

export const MeghdootOSH: React.FC = () => {
  return (
    <AbsoluteFill style={{backgroundColor: C.navyDeep}}>
      {SHOTS.map((s, i) => {
        const next = SHOTS[i + 1];
        const from = startOf(s);
        const end = next ? (isCover(next.enter) ? next.cut : next.cut + Math.ceil(next.T / 2)) : TOTAL_FRAMES;
        return (
          <Sequence key={i} from={from} durationInFrames={end - from} name={`Shot ${i} @${s.cut}`}>
            <Shot
              enter={inType(s.enter)}
              enterT={isCover(s.enter) ? 0 : s.T}
              exit={next ? outType(next.enter) : 'none'}
              exitT={next && !isCover(next.enter) ? next.T : 0}
              origin={s.origin}
            >
              {s.el}
            </Shot>
          </Sequence>
        );
      })}

      {BUG.map(([a, b]) => (
        <Sequence key={a} from={a} durationInFrames={b - a} name="Logo bug">
          <BrandBug />
        </Sequence>
      ))}

      {CAPTIONS.map((c) => (
        <Sequence key={c.from} from={c.from} durationInFrames={c.to - c.from} name={`Caption: ${c.text}`}>
          <Caption label={c.label} text={c.text} size={c.size} accent={c.accent} />
        </Sequence>
      ))}

      {SHOTS.filter((s) => isCover(s.enter) || s.enter === 'flash').map((s) => {
        const from = s.cut - Math.floor(s.T / 2);
        return (
          <Sequence key={`ov${s.cut}`} from={from} durationInFrames={s.T + 12} name={`${s.enter} @${s.cut}`}>
            {s.enter === 'swoosh' ? <SwooshWipe T={s.T} /> : s.enter === 'shutter' ? <ShutterWipe T={s.T} /> : <Flash T={s.T} />}
          </Sequence>
        );
      })}

      <Audio
        src={staticFile('audio/inspired.mp3')}
        volume={(f) => interpolate(f, [0, 6, TOTAL_FRAMES - 90, TOTAL_FRAMES - 4], [0, 0.9, 0.9, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'})}
      />
      {SHOTS.slice(1).map((s) => {
        const short = s.T <= 10;
        const peak = short ? SHORT_PEAK : WHOOSH_PEAK;
        return (
          <Sequence key={`sfx${s.cut}`} from={s.cut - peak} durationInFrames={30} name="whoosh">
            <Audio src={staticFile(short ? 'audio/whoosh_short.wav' : 'audio/whoosh.wav')} volume={short ? 0.16 : 0.26} />
          </Sequence>
        );
      })}
      <Sequence from={4} durationInFrames={30} name="intro whoosh">
        <Audio src={staticFile('audio/whoosh.wav')} volume={0.22} />
      </Sequence>
      {BOOMS.map((f) => (
        <Sequence key={`boom${f}`} from={f} durationInFrames={66} name="boom">
          <Audio src={staticFile('audio/boom.wav')} volume={0.42} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
