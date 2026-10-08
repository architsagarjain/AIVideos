import React from 'react';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CARD, FONT_DISPLAY, FONT_TEXT, HEIGHT, photo} from '../theme';
import {Card, Header, KenBurns, Page, Pic, ProgressLine} from './Photo';
import {Caption, Label, Pin, RevealWords} from './Text';
import {InType, OutType, Shot} from './Transitions';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const gradientBar = `linear-gradient(90deg, ${C.orange}, ${C.blue})`;

// Three light streaks echoing the logo's swoosh.
const Streaks: React.FC = () => {
  const frame = useCurrentFrame();
  const streak = (color: string, h: number, delay: number, y: number) => {
    const p = interpolate(frame, [delay, delay + 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return (
      <div
        style={{
          position: 'absolute',
          left: -1300 + p * 1900,
          top: y - p * 520,
          width: 900,
          height: h,
          borderRadius: h,
          background: `linear-gradient(90deg, transparent, ${color})`,
          transform: 'rotate(-30deg)',
          opacity: Math.sin(p * Math.PI),
        }}
      />
    );
  };
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      {streak(C.orange, 14, 0, 980)}
      {streak(C.muted, 8, 3, 1040)}
      {streak(C.blue, 11, 6, 1100)}
    </AbsoluteFill>
  );
};

export const LogoIntro: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pop = spring({frame: frame - 6, fps, config: {damping: 13, stiffness: 120, mass: 0.8}});
  const reveal = interpolate(frame, [16, 44], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const drift = interpolate(frame, [0, 135], [1, 1.05]);
  const line = interpolate(frame, [52, 76], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <Page>
      <Streaks />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})`}}>
        <div
          style={{
            width: 900,
            transform: `scale(${0.55 + 0.45 * pop})`,
            transformOrigin: '12% 50%',
            opacity: interpolate(frame, [6, 12], [0, 1], clamp),
            clipPath: `inset(-10% ${(1 - reveal) * 74}% -10% -10%)`,
          }}
        >
          <Img src={staticFile('logo.png')} style={{width: '100%', display: 'block'}} />
        </div>
        <div style={{marginTop: 54, height: 6, width: 620 * line, borderRadius: 3, background: gradientBar}} />
        <div style={{marginTop: 30}}>
          <Label text="A glimpse from OSH India 2026" delay={64} color={C.muted} size={26} />
        </div>
      </AbsoluteFill>
    </Page>
  );
};

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const loc = interpolate(frame, [44, 58], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const card = spring({frame: frame - 8, fps: 30, config: {damping: 200}, durationInFrames: 26});
  return (
    <Page>
      <Header animate />
      <div style={{position: 'absolute', left: 48, top: 168, display: 'flex', flexDirection: 'column'}}>
        <RevealWords text="EXPLORING" delay={14} size={104} weight={900} lineHeight={1.02} />
        <RevealWords text="SAFER" delay={20} size={138} weight={900} color={C.orange} lineHeight={0.98} />
        <RevealWords text="TOMORROWS" delay={26} size={104} weight={900} lineHeight={1.02} />
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: loc,
            transform: `translateY(${(1 - loc) * 20}px)`,
            fontFamily: FONT_TEXT,
            fontWeight: 500,
            fontSize: 32,
            color: C.muted,
          }}
        >
          <Pin size={34} color={C.blue} />
          OSH India 2026 · Goregaon, Mumbai
        </div>
      </div>
      <Card x={CARD.x} y={640} w={CARD.w} h={670} style={{transform: `translateY(${(1 - card) * 700}px)`}}>
        <KenBurns pic={{n: photo(9), fy: 28, zoom: [1.16, 1.04]}} />
      </Card>
    </Page>
  );
};

// ---- Photo sections: shots change inside one card, captions sit underneath.

export type CardShot = {at: number; enter: InType; T: number; pic: Pic; origin?: [number, number]};
export type CardCaption = {from: number; to: number; label: string; text: string; size?: number; accent?: Record<string, string>};

const outFor = (e: InType): OutType => (e === 'whip' || e === 'zoom' || e === 'push' ? e : 'none');

// `lead` = frames this section is on screen before its own cut (when it transitions in over the previous one).
export const PhotoSection: React.FC<{shots: CardShot[]; captions: CardCaption[]; lead?: number}> = ({shots, captions, lead = 0}) => {
  const {durationInFrames} = useVideoConfig();
  return (
    <Page>
      <Header />
      <Card x={CARD.x} y={CARD.y} w={CARD.w} h={CARD.h}>
        {shots.map((s, i) => {
          const next = shots[i + 1];
          const from = i === 0 ? 0 : lead + s.at - Math.floor(s.T / 2);
          const end = next ? lead + next.at + Math.ceil(next.T / 2) : durationInFrames;
          return (
            <Sequence key={i} from={from} durationInFrames={end - from} layout="none">
              <Shot
                enter={i === 0 ? 'cut' : s.enter}
                enterT={i === 0 ? 0 : s.T}
                exit={next ? outFor(next.enter) : 'none'}
                exitT={next ? next.T : 0}
                origin={s.origin ?? [CARD.w / 2, CARD.h / 2]}
              >
                <KenBurns pic={s.pic} />
              </Shot>
            </Sequence>
          );
        })}
      </Card>
      <ProgressLine y={CARD.y + CARD.h + 20} start={lead} />
      {captions.map((c) => (
        <Sequence key={c.from} from={lead + c.from} durationInFrames={c.to - c.from}>
          <Caption label={c.label} text={c.text} size={c.size} accent={c.accent} />
        </Sequence>
      ))}
    </Page>
  );
};

// ---- Team: group photo + one card per name.

const NAMES = ['Rahul Purohit', 'Raju Sahu', 'Suresh Sharma', 'Dayanand Dhali'];
const initials = (n: string) =>
  n
    .split(' ')
    .map((w) => w[0])
    .join('');

const NameCard: React.FC<{name: string; i: number; delay: number}> = ({name, i, delay}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - delay, fps, config: {damping: 14, stiffness: 140}});
  const badge = spring({frame: frame - delay - 4, fps, config: {damping: 10, stiffness: 160}});
  const accent = i % 3 === 0 ? C.orange : C.blue;
  const [first, ...rest] = name.split(' ');
  return (
    <div
      style={{
        position: 'relative',
        height: 214,
        borderRadius: 26,
        backgroundColor: C.white,
        boxShadow: '0 18px 40px rgba(29,36,51,0.12)',
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        padding: '0 28px',
        overflow: 'hidden',
        opacity: s,
        transform: `translateY(${(1 - s) * 60}px) scale(${0.92 + 0.08 * s})`,
      }}
    >
      <div style={{position: 'absolute', left: 0, top: 0, bottom: 0, width: 10, background: accent}} />
      <div
        style={{
          flexShrink: 0,
          width: 104,
          height: 104,
          borderRadius: 52,
          background: i % 3 === 0 ? `linear-gradient(135deg, ${C.orange}, #F79A5E)` : `linear-gradient(135deg, ${C.blue}, #3FB0E6)`,
          color: C.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: FONT_DISPLAY,
          fontWeight: 800,
          fontSize: 40,
          letterSpacing: '0.02em',
          transform: `scale(${badge}) rotate(${(1 - badge) * -90}deg)`,
          boxShadow: `0 10px 24px ${i % 3 === 0 ? 'rgba(241,104,43,0.35)' : 'rgba(5,133,195,0.35)'}`,
        }}
      >
        {initials(name)}
      </div>
      <div style={{fontFamily: FONT_DISPLAY, color: C.ink, lineHeight: 1.04}}>
        <div style={{fontWeight: 600, fontSize: 36, color: C.muted}}>{first}</div>
        <div style={{fontWeight: 900, fontSize: 50}}>{rest.join(' ')}</div>
      </div>
    </div>
  );
};

export const TeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const card = spring({frame: frame - 4, fps: 30, config: {damping: 200}, durationInFrames: 22});
  return (
    <Page>
      <Header />
      <div style={{position: 'absolute', left: 48, top: 156, display: 'flex', flexDirection: 'column', gap: 8}}>
        <Label text="Representing Meghdoot at OSH India" delay={6} />
        <RevealWords text="Meet the Team" delay={10} size={76} weight={900} accent={{Team: C.orange}} />
      </div>
      <Card x={CARD.x} y={296} w={CARD.w} h={520} style={{transform: `scale(${0.94 + 0.06 * card})`, opacity: card}}>
        <KenBurns pic={{n: photo(39), fx: 50, fy: 40, zoom: [1.02, 1.1]}} />
      </Card>
      <div
        style={{
          position: 'absolute',
          left: 40,
          right: 40,
          top: 846,
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 24,
        }}
      >
        {NAMES.map((n, i) => (
          <NameCard key={n} name={n} i={i} delay={30 + i * 12} />
        ))}
      </div>
    </Page>
  );
};

// ---- Three photo strips with the industry's everyday realities.

export const Triptych: React.FC = () => {
  const frame = useCurrentFrame();
  const strips: [number, number][] = [
    [24, 40],
    [37, 45],
    [20, 45],
  ];
  const gap = 16;
  const w = (CARD.w - gap * 2) / 3;
  const top = CARD.y;
  const h = HEIGHT - top - 36;
  const lines = ['HEAVY LIFTING.', 'SPECIALIZED TRANSPORT.', 'WORK AT HEIGHT.'];
  return (
    <Page>
      <Header />
      {strips.map(([n, fy], i) => {
        const p = interpolate(frame, [i * 5, i * 5 + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <Card key={n} x={CARD.x + i * (w + gap)} y={top} w={w} h={h} style={{clipPath: `inset(${(1 - p) * 100}% 0 0 0 round 32px)`}}>
            <KenBurns pic={{n: photo(n), fy, zoom: [1.12, 1.2]}} />
          </Card>
        );
      })}
      <AbsoluteFill style={{top, height: h, justifyContent: 'center', alignItems: 'center', gap: 18}}>
        {lines.map((l, i) => {
          const d = 15 + i * 15;
          const bar = interpolate(frame, [d, d + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          return (
            <div key={l} style={{position: 'relative', padding: '10px 28px'}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: 14,
                  background: 'rgba(255,255,255,0.96)',
                  boxShadow: '0 14px 30px rgba(29,36,51,0.22)',
                  borderLeft: `10px solid ${i === 1 ? C.blue : C.orange}`,
                  transform: `scaleX(${bar})`,
                  transformOrigin: 'left',
                }}
              />
              <div style={{position: 'relative'}}>
                <RevealWords text={l} delay={d + 4} size={60} weight={900} />
              </div>
            </div>
          );
        })}
        <div style={{marginTop: 16, position: 'relative', padding: '10px 26px'}}>
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 999,
              background: gradientBar,
              opacity: interpolate(frame, [62, 72], [0, 1], clamp),
            }}
          />
          <div style={{position: 'relative'}}>
            <RevealWords text="are part of our everyday operations" delay={64} stagger={2} size={34} weight={700} color={C.white} align="center" />
          </div>
        </div>
      </AbsoluteFill>
    </Page>
  );
};

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const under = interpolate(frame, [62, 84], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const quote = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  const card = spring({frame: frame - 6, fps: 30, config: {damping: 200}, durationInFrames: 26});
  return (
    <Page>
      <Header />
      <div style={{position: 'absolute', left: 56, right: 56, top: 160, display: 'flex', flexDirection: 'column', gap: 20}}>
        <svg width={92} height={72} viewBox="0 0 110 86" style={{transform: `scale(${quote})`, transformOrigin: 'left bottom'}}>
          <path
            fill={C.orange}
            d="M0 86V52C0 22 14 5 42 0l5 12C32 17 25 28 24 42h22v44H0zm60 0V52c0-30 14-47 42-52l5 12c-15 5-22 16-23 30h22v44H60z"
          />
        </svg>
        <RevealWords text="Because safety is not just a priority on site." delay={10} stagger={3} size={58} weight={700} lineHeight={1.12} color={C.muted} />
        <RevealWords
          text="It is a commitment we continue to strengthen."
          delay={42}
          stagger={3}
          size={60}
          weight={900}
          lineHeight={1.12}
          accent={{commitment: C.orange, strengthen: C.blue}}
        />
        <div style={{height: 8, width: 360 * under, borderRadius: 4, background: gradientBar}} />
      </div>
      <Card x={CARD.x} y={660} w={CARD.w} h={650} style={{transform: `translateY(${(1 - card) * 700}px)`}}>
        <KenBurns pic={{n: photo(13), fy: 38, zoom: [1.04, 1.16]}} />
      </Card>
    </Page>
  );
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 14, fps, config: {damping: 16, stiffness: 110}});
  const line = interpolate(frame, [30, 52], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const tags = ['#MeghdootInfra', '#OSHIndia2026', '#SafetyFirst'];
  return (
    <Page>
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 880, opacity: logo, transform: `scale(${0.85 + 0.15 * logo}) translateY(${(1 - logo) * 30}px)`}}>
          <Img src={staticFile('logo.png')} style={{width: '100%', display: 'block'}} />
        </div>
        <div style={{marginTop: 56, height: 6, width: 620 * line, borderRadius: 3, background: gradientBar}} />
        <div style={{marginTop: 40, display: 'flex', gap: 22}}>
          {tags.map((t, i) => {
            const s = spring({frame: frame - 40 - i * 6, fps, config: {damping: 14}});
            const col = i === 1 ? C.orange : C.blue;
            return (
              <div
                key={t}
                style={{
                  padding: '12px 22px',
                  borderRadius: 999,
                  background: C.white,
                  border: `2px solid ${col}`,
                  color: i === 1 ? C.orangeDeep : C.blueDeep,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 30,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 24}px)`,
                }}
              >
                {t}
              </div>
            );
          })}
        </div>
        <div style={{marginTop: 34}}>
          <Label text="OSH India 2026 · Goregaon, Mumbai" delay={58} color={C.muted} size={24} />
        </div>
      </AbsoluteFill>
    </Page>
  );
};
