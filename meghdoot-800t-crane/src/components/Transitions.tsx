import React from 'react';
import {AbsoluteFill, Easing, interpolate, useCurrentFrame} from 'remotion';
import {C, HEIGHT, WIDTH} from '../theme';
import {useShotLength} from './Photo';

// In-shot transitions: the incoming shot animates over the outgoing one.
export type InType = 'cut' | 'slice' | 'iris' | 'whip' | 'zoom' | 'push' | 'fade';
// Exits are what the outgoing shot does while the next one comes in.
export type OutType = 'none' | 'whip' | 'zoom' | 'push';

const ease = Easing.bezier(0.65, 0, 0.35, 1);
const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export const Shot: React.FC<{
  enter: InType;
  enterT: number;
  exit: OutType;
  exitT: number;
  origin?: [number, number];
  children: React.ReactNode;
}> = ({enter, enterT, exit, exitT, origin = [WIDTH / 2, HEIGHT / 2], children}) => {
  const frame = useCurrentFrame();
  const dur = useShotLength();
  const p = enterT > 0 ? interpolate(frame, [0, enterT], [0, 1], {...clamp, easing: ease}) : 1;
  const q = exitT > 0 ? interpolate(frame, [dur - exitT, dur], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)}) : 0;

  let transform = '';
  let filter = '';
  let opacity = 1;
  let clipPath: string | undefined;
  let accent: React.ReactNode = null;

  if (enter === 'slice' && p < 1) {
    const x = -32 + 132 * p;
    clipPath = `polygon(0 0, ${x + 32}% 0, ${x}% 100%, 0 100%)`;
    accent = (
      <AbsoluteFill
        style={{
          background: C.orange,
          clipPath: `polygon(${x + 32}% 0, ${x + 33.6}% 0, ${x + 1.6}% 100%, ${x}% 100%)`,
          boxShadow: `0 0 40px ${C.orange}`,
        }}
      />
    );
  }
  if (enter === 'iris' && p < 1) {
    const r = 1000 * p;
    clipPath = `circle(${r}px at ${origin[0]}px ${origin[1]}px)`;
    accent = (
      <div
        style={{
          position: 'absolute',
          left: origin[0] - r - 9,
          top: origin[1] - r - 9,
          width: (r + 9) * 2,
          height: (r + 9) * 2,
          borderRadius: '50%',
          border: `14px solid ${C.orange}`,
          boxShadow: `0 0 0 10px ${C.blue}`,
          opacity: 1 - p * 0.3,
        }}
      />
    );
  }
  if (enter === 'whip' && p < 1) {
    transform += ` translateX(${(1 - p) * 105}%)`;
    filter += ` blur(${Math.sin(p * Math.PI) * 18}px)`;
  }
  if (enter === 'push' && p < 1) {
    transform += ` translateY(${(1 - p) * 100}%)`;
  }
  if (enter === 'zoom' && p < 1) {
    transform += ` scale(${1.45 - 0.45 * p})`;
    filter += ` blur(${(1 - p) * 22}px)`;
    opacity = interpolate(p, [0, 0.45], [0, 1], clamp);
  }
  if (enter === 'fade' && p < 1) opacity = p;

  if (exit === 'whip' && q > 0) {
    transform += ` translateX(${-q * 45}%)`;
    filter += ` blur(${q * 16}px)`;
  }
  if (exit === 'push' && q > 0) {
    transform += ` translateY(${-q * 35}%) scale(${1 - q * 0.08})`;
    filter += ` brightness(${1 - q * 0.5})`;
  }
  if (exit === 'zoom' && q > 0) {
    transform += ` scale(${1 + q * 0.35})`;
    filter += ` blur(${q * 12}px)`;
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          transform: transform || undefined,
          filter: filter || undefined,
          opacity,
          clipPath,
          overflow: 'hidden',
        }}
      >
        {children}
      </AbsoluteFill>
      {accent}
    </AbsoluteFill>
  );
};

// ---- Cover transitions: drawn above everything, the cut happens underneath at mid-point.

// Diagonal brand swoosh in the logo's orange / white / blue.
export const SwooshWipe: React.FC<{T: number}> = ({T}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [0, T], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  // Navy body (2600px) is centred on screen exactly at the mid-point, where the cut happens.
  const x = interpolate(p, [0, 1], [-914 - 2700, -914 + 2700]);
  const stripes: [string, number][] = [
    [C.orange, 120],
    [C.white, 30],
    [C.orange, 60],
    [C.white, 40],
    [C.blue, 2600],
    [C.white, 30],
    [C.orange, 94],
    [C.white, 30],
  ];
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          top: -200,
          height: HEIGHT + 400,
          left: 0,
          display: 'flex',
          flexDirection: 'row-reverse',
          transform: `translateX(${x}px) skewX(-22deg)`,
        }}
      >
        {stripes.map(([c, w], i) => (
          <div key={i} style={{width: w, height: '100%', background: c}} />
        ))}
      </div>
    </AbsoluteFill>
  );
};

// Vertical blinds that close then open.
export const ShutterWipe: React.FC<{T: number; bars?: number}> = ({T, bars = 6}) => {
  const frame = useCurrentFrame();
  const half = T / 2;
  return (
    <AbsoluteFill style={{flexDirection: 'row', pointerEvents: 'none'}}>
      {new Array(bars).fill(0).map((_, i) => {
        const d = i * 1.5;
        const closing = interpolate(frame, [d * 0.5, half - 1], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        const opening = interpolate(frame, [half + 1 + d, T + d], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
        const closed = frame < half + 1 + d;
        return (
          <div key={i} style={{flex: 1, height: '100%', position: 'relative', marginLeft: -1}}>
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: i % 2 === 0 ? C.white : C.light,
                borderLeft: `6px solid ${i % 2 === 0 ? C.orange : C.blue}`,
                transformOrigin: closed ? 'top' : 'bottom',
                transform: `scaleY(${closed ? closing : 1 - opening})`,
              }}
            />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

export const Flash: React.FC<{T: number}> = ({T}) => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, T * 0.45, T], [0, 0.95, 0], clamp);
  return <AbsoluteFill style={{backgroundColor: '#FFF6EA', opacity: o, pointerEvents: 'none'}} />;
};
