import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, HEIGHT, WIDTH} from '../theme';

// Inside a <Sequence>, useVideoConfig() reports that sequence's length.
export const useShotLength = () => useVideoConfig().durationInFrames;

export type KB = {from: number; to: number; x?: [number, number]; y?: [number, number]};

export const KenBurns: React.FC<{
  src: string;
  kb?: KB;
  focus?: string;
  style?: React.CSSProperties;
}> = ({src, kb = {from: 1.06, to: 1.16}, focus = '50% 35%', style}) => {
  const frame = useCurrentFrame();
  const dur = useShotLength();
  const p = interpolate(frame, [0, dur], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.sin),
  });
  const scale = kb.from + (kb.to - kb.from) * p;
  const x = kb.x ? kb.x[0] + (kb.x[1] - kb.x[0]) * p : 0;
  const y = kb.y ? kb.y[0] + (kb.y[1] - kb.y[0]) * p : 0;
  return (
    <div style={{position: 'absolute', inset: 0, overflow: 'hidden', ...style}}>
      <Img
        src={src}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: focus,
          transform: `translate(${x}px, ${y}px) scale(${scale})`,
        }}
      />
    </div>
  );
};

const Shade: React.FC<{strength?: number}> = ({strength = 1}) => (
  <AbsoluteFill
    style={{
      background: `linear-gradient(180deg, rgba(6,18,35,${0.45 * strength}) 0%, rgba(6,18,35,0) 22%, rgba(6,18,35,0) 45%, rgba(6,18,35,${0.88 * strength}) 100%)`,
    }}
  />
);

export const PortraitShot: React.FC<{n: string; kb?: KB; focus?: string; shade?: number}> = ({
  n,
  kb,
  focus,
  shade = 1,
}) => (
  <AbsoluteFill style={{backgroundColor: C.navyDeep}}>
    <KenBurns src={n} kb={kb} focus={focus} />
    <Shade strength={shade} />
  </AbsoluteFill>
);

// A wide photo shown large on a card, with a blurred copy of itself behind.
export const LandscapeShot: React.FC<{
  n: string;
  kb?: KB;
  focus?: string;
  top?: number;
  height?: number;
}> = ({n, kb = {from: 1.02, to: 1.12}, focus = '50% 50%', top = 170, height = 700}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lift = spring({frame, fps, config: {damping: 200}, durationInFrames: 24});
  return (
    <AbsoluteFill style={{backgroundColor: C.navyDeep}}>
      <Img
        src={n}
        style={{
          position: 'absolute',
          inset: -80,
          width: WIDTH + 160,
          height: HEIGHT + 160,
          objectFit: 'cover',
          filter: 'blur(36px) brightness(0.42) saturate(1.2)',
        }}
      />
      <AbsoluteFill
        style={{background: 'linear-gradient(180deg, rgba(6,18,35,0.15) 0%, rgba(6,18,35,0.75) 100%)'}}
      />
      <div
        style={{
          position: 'absolute',
          left: 40,
          top,
          width: WIDTH - 80,
          height,
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: '0 30px 80px rgba(0,0,0,0.55)',
          border: '3px solid rgba(255,255,255,0.9)',
          transform: `translateY(${(1 - lift) * 30}px)`,
        }}
      >
        <KenBurns src={n} kb={kb} focus={focus} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 40,
          top: top + height + 22,
          height: 6,
          width: (WIDTH - 80) * lift,
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.orangeDeep}, ${C.orange} 45%, ${C.blue})`,
        }}
      />
    </AbsoluteFill>
  );
};

// Two wide photos stacked, sliding in from opposite sides.
export const SplitShot: React.FC<{
  a: string;
  b: string;
  focusA?: string;
  focusB?: string;
  children?: React.ReactNode;
  cardH?: number;
  gap?: number;
}> = ({a, b, focusA = '50% 45%', focusB = '50% 45%', children, cardH = 500, gap = 230}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inA = spring({frame, fps, config: {damping: 18, stiffness: 90}});
  const inB = spring({frame: frame - 6, fps, config: {damping: 18, stiffness: 90}});
  const top = (HEIGHT - (cardH * 2 + gap)) / 2;
  const card = (src: string, focus: string, y: number, p: number, dir: number, kb: KB) => (
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: y,
        width: WIDTH - 80,
        height: cardH,
        borderRadius: 26,
        overflow: 'hidden',
        border: '3px solid rgba(255,255,255,0.9)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        transform: `translateX(${(1 - p) * dir * 1150}px) rotate(${(1 - p) * dir * 4}deg)`,
      }}
    >
      <KenBurns src={src} focus={focus} kb={kb} />
    </div>
  );
  return (
    <AbsoluteFill style={{backgroundColor: C.navy}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 20% 15%, rgba(30,154,214,0.35), transparent 55%), radial-gradient(circle at 85% 90%, rgba(238,74,35,0.30), transparent 55%)`,
        }}
      />
      {card(a, focusA, top, inA, -1, {from: 1.04, to: 1.14, x: [-10, 10]})}
      {card(b, focusB, top + cardH + gap, inB, 1, {from: 1.14, to: 1.04, x: [10, -10]})}
      <div style={{position: 'absolute', left: 0, right: 0, top: top + cardH, height: gap}}>{children}</div>
    </AbsoluteFill>
  );
};
