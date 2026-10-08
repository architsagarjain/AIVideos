import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_DISPLAY, WIDTH} from '../theme';

// Inside a <Sequence>, useVideoConfig() reports that sequence's length.
export const useShotLength = () => useVideoConfig().durationInFrames;

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

export type Pic = {
  n: string;
  // Focus point in %, used as object-position.
  fx?: number;
  fy?: number;
  // Horizontal pan across a wide photo, in object-position %.
  pan?: [number, number];
  zoom?: [number, number];
};

// Slow push-in, plus an optional pan so wide photos reveal the whole scene.
export const KenBurns: React.FC<{pic: Pic}> = ({pic}) => {
  const frame = useCurrentFrame();
  const dur = useShotLength();
  const p = interpolate(frame, [0, dur], [0, 1], {...clamp, easing: Easing.inOut(Easing.sin)});
  const [z0, z1] = pic.zoom ?? [1.04, 1.12];
  const fx = pic.pan ? pic.pan[0] + (pic.pan[1] - pic.pan[0]) * p : pic.fx ?? 50;
  return (
    <AbsoluteFill style={{overflow: 'hidden'}}>
      <Img
        src={pic.n}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: `${fx}% ${pic.fy ?? 40}%`,
          transform: `scale(${z0 + (z1 - z0) * p})`,
          transformOrigin: `${fx}% ${pic.fy ?? 40}%`,
        }}
      />
    </AbsoluteFill>
  );
};

// Light brand page with soft colour glows and faint diagonal lines.
export const Page: React.FC<{children?: React.ReactNode}> = ({children}) => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: C.light}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 95% 4%, rgba(241,104,43,0.13), transparent 40%), radial-gradient(circle at 0% 100%, rgba(5,133,195,0.12), transparent 45%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(-35deg, rgba(29,36,51,0.028) 0 2px, transparent 2px 48px)',
          backgroundPosition: `${frame * 0.5}px 0`,
        }}
      />
      {children}
    </AbsoluteFill>
  );
};

export const Header: React.FC<{animate?: boolean}> = ({animate = false}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = animate ? spring({frame: frame - 4, fps, config: {damping: 200}, durationInFrames: 22}) : 1;
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        right: 40,
        top: 34,
        height: 96,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        opacity: p,
        transform: `translateY(${(1 - p) * -30}px)`,
      }}
    >
      <Img src={staticFile('logo.png')} style={{width: 380, display: 'block'}} />
      <div style={{textAlign: 'right', fontFamily: FONT_DISPLAY}}>
        <div style={{fontWeight: 800, fontSize: 26, letterSpacing: '0.16em', color: C.orange}}>OSH INDIA 2026</div>
        <div style={{fontWeight: 600, fontSize: 20, letterSpacing: '0.2em', color: C.muted, marginTop: 4}}>
          GOREGAON · MUMBAI
        </div>
      </div>
    </div>
  );
};

// Rounded photo frame; its children are clipped to it.
export const Card: React.FC<{
  x: number;
  y: number;
  w: number;
  h: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({x, y, w, h, children, style}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: w,
      height: h,
      borderRadius: 32,
      overflow: 'hidden',
      backgroundColor: C.white,
      boxShadow: '0 26px 60px rgba(29,36,51,0.18), 0 4px 12px rgba(29,36,51,0.08)',
      ...style,
    }}
  >
    {children}
  </div>
);

// Brand line that fills left to right over the section.
export const ProgressLine: React.FC<{y: number; start?: number}> = ({y, start = 0}) => {
  const frame = useCurrentFrame();
  const dur = useShotLength();
  const p = interpolate(frame, [start, dur], [0, 1], clamp);
  return (
    <div style={{position: 'absolute', left: 40, top: y, width: WIDTH - 80, height: 6, borderRadius: 3, background: C.hairline}}>
      <div
        style={{
          width: `${p * 100}%`,
          height: '100%',
          borderRadius: 3,
          background: `linear-gradient(90deg, ${C.orange}, ${C.blue})`,
        }}
      />
    </div>
  );
};
