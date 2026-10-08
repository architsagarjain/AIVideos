import React from 'react';
import {Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_DISPLAY, FONT_TEXT} from '../theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Words rise out of a mask one after another.
export const RevealWords: React.FC<{
  text: string;
  delay?: number;
  stagger?: number;
  size: number;
  weight?: number;
  color?: string;
  accent?: Record<string, string>;
  family?: string;
  lineHeight?: number;
  letterSpacing?: string;
  align?: 'left' | 'center';
  outAt?: number;
}> = ({
  text,
  delay = 0,
  stagger = 3,
  size,
  weight = 800,
  color = C.white,
  accent = {},
  family = FONT_DISPLAY,
  lineHeight = 1.08,
  letterSpacing = '-0.01em',
  align = 'left',
  outAt,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const words = text.split(' ');
  const out = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 10], [0, 1], {...clamp, easing: Easing.in(Easing.cubic)});
  return (
    <div
      style={{
        fontFamily: family,
        fontWeight: weight,
        fontSize: size,
        lineHeight,
        letterSpacing,
        color,
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: align === 'center' ? 'center' : 'flex-start',
        columnGap: size * 0.26,
      }}
    >
      {words.map((w, i) => {
        const s = spring({frame: frame - delay - i * stagger, fps, config: {damping: 16, stiffness: 140, mass: 0.7}});
        const key = w.replace(/[.,]/g, '');
        return (
          <span key={i} style={{overflow: 'hidden', display: 'inline-block', paddingBottom: size * 0.08, marginBottom: -size * 0.08}}>
            <span
              style={{
                display: 'inline-block',
                transform: `translateY(${(1 - s) * 110 - out * 110}%) rotate(${(1 - s) * 6}deg)`,
                transformOrigin: 'left bottom',
                color: accent[key] ?? color,
              }}
            >
              {w}
            </span>
          </span>
        );
      })}
    </div>
  );
};

export const Label: React.FC<{text: string; delay?: number; color?: string; size?: number; outAt?: number}> = ({
  text,
  delay = 0,
  color = C.orange,
  size = 24,
  outAt,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [delay, delay + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const out = outAt === undefined ? 0 : interpolate(frame, [outAt, outAt + 8], [0, 1], clamp);
  return (
    <div
      style={{
        fontFamily: FONT_DISPLAY,
        fontWeight: 700,
        fontSize: size,
        letterSpacing: '0.22em',
        textTransform: 'uppercase',
        color,
        opacity: p * (1 - out),
        transform: `translateX(${(1 - p) * -30}px)`,
        whiteSpace: 'nowrap',
      }}
    >
      {text}
    </div>
  );
};

// Lower-third caption: brand bar + small label + headline.
export const Caption: React.FC<{
  label: string;
  text: string;
  accent?: Record<string, string>;
  size?: number;
  bottom?: number;
}> = ({label, text, accent, size = 56, bottom = 110}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const outAt = durationInFrames - 12;
  const bar = interpolate(frame, [0, 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const barOut = interpolate(frame, [outAt, outAt + 12], [1, 0], clamp);
  return (
    <div style={{position: 'absolute', left: 64, right: 64, bottom, display: 'flex', gap: 26}}>
      <div
        style={{
          width: 8,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${C.orange}, ${C.orangeDeep} 50%, ${C.blue})`,
          transform: `scaleY(${bar * barOut})`,
          transformOrigin: 'top',
        }}
      />
      <div style={{display: 'flex', flexDirection: 'column', gap: 16, textShadow: '0 4px 24px rgba(0,0,0,0.45)'}}>
        <Label text={label} delay={4} outAt={outAt} />
        <RevealWords text={text} delay={8} size={size} weight={800} accent={accent} outAt={outAt} />
      </div>
    </div>
  );
};

// Small logo badge pinned to the top-left during the photo sections.
export const BrandBug: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const inn = spring({frame, fps, config: {damping: 200}, durationInFrames: 20});
  const out = interpolate(frame, [durationInFrames - 12, durationInFrames], [0, 1], clamp);
  return (
    <div
      style={{
        position: 'absolute',
        left: 40,
        top: 40,
        padding: '12px 20px',
        borderRadius: 18,
        background: 'rgba(255,255,255,0.94)',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
        transform: `translateY(${(1 - inn) * -140 + out * -140}px)`,
      }}
    >
      <Img src={staticFile('logo.png')} style={{width: 270, display: 'block'}} />
    </div>
  );
};

export const Pin: React.FC<{size: number; color: string}> = ({size, color}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
    <path d="M12 2C8.1 2 5 5.1 5 9c0 5.2 7 13 7 13s7-7.8 7-13c0-3.9-3.1-7-7-7zm0 9.5A2.5 2.5 0 1 1 12 6.5a2.5 2.5 0 0 1 0 5z" />
  </svg>
);

export const textFont = FONT_TEXT;
