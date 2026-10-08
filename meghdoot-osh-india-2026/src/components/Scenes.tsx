import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, FONT_DISPLAY, FONT_TEXT, HEIGHT, WIDTH, photo} from '../theme';
import {KenBurns, PortraitShot, SplitShot} from './Photo';
import {Label, Pin, RevealWords} from './Text';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const LightBackdrop: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{backgroundColor: C.offWhite}}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, #FFFFFF 0%, ${C.offWhite} 55%, #E6ECF3 100%)`,
        }}
      />
      <AbsoluteFill
        style={{
          backgroundImage: 'repeating-linear-gradient(-35deg, rgba(11,28,51,0.035) 0 2px, transparent 2px 46px)',
          backgroundPosition: `${frame * 0.6}px 0`,
        }}
      />
    </AbsoluteFill>
  );
};

// Three light streaks echoing the logo's swoosh.
const Streaks: React.FC<{start: number}> = ({start}) => {
  const frame = useCurrentFrame();
  const streak = (color: string, h: number, delay: number, y: number) => {
    const p = interpolate(frame, [start + delay, start + delay + 22], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
    return (
      <div
        style={{
          position: 'absolute',
          left: -400 + p * 1900 - 900,
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
      {streak(C.orangeDeep, 14, 0, 980)}
      {streak(C.grey, 8, 3, 1040)}
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
  const logoW = 900;
  return (
    <AbsoluteFill>
      <LightBackdrop />
      <Streaks start={0} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `scale(${drift})`}}>
        <div
          style={{
            width: logoW,
            transform: `scale(${0.55 + 0.45 * pop})`,
            transformOrigin: '12% 50%',
            opacity: interpolate(frame, [6, 12], [0, 1], clamp),
            clipPath: `inset(-10% ${(1 - reveal) * 74}% -10% -10%)`,
          }}
        >
          <Img src={staticFile('logo.png')} style={{width: '100%', display: 'block'}} />
        </div>
        <div
          style={{
            marginTop: 54,
            height: 6,
            width: 620 * line,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${C.orangeDeep}, ${C.orange} 45%, ${C.blue})`,
          }}
        />
        <div style={{marginTop: 30}}>
          <Label text="A glimpse from OSH India 2026" delay={64} color={C.grey} size={26} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const TitleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const pill = spring({frame: frame - 12, fps, config: {damping: 14}});
  const loc = interpolate(frame, [44, 58], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <AbsoluteFill>
      <PortraitShot n={photo(9)} kb={{from: 1.2, to: 1.06, y: [-20, 10]}} focus="50% 30%" shade={1.15} />
      <AbsoluteFill
        style={{background: 'linear-gradient(180deg, rgba(6,18,35,0) 35%, rgba(6,18,35,0.78) 70%, rgba(6,18,35,0.95) 100%)'}}
      />
      <div style={{position: 'absolute', left: 64, right: 64, bottom: 96, display: 'flex', flexDirection: 'column', gap: 14}}>
        <div
          style={{
            alignSelf: 'flex-start',
            padding: '10px 22px',
            borderRadius: 999,
            background: `linear-gradient(90deg, ${C.orangeDeep}, ${C.orange})`,
            fontFamily: FONT_DISPLAY,
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: '0.16em',
            color: C.white,
            transform: `scale(${pill})`,
            transformOrigin: 'left center',
            marginBottom: 10,
          }}
        >
          OSH INDIA 2026
        </div>
        <RevealWords text="EXPLORING" delay={18} size={118} weight={900} />
        <RevealWords text="SAFER" delay={24} size={150} weight={900} color={C.orange} lineHeight={0.98} />
        <RevealWords text="TOMORROWS" delay={30} size={118} weight={900} />
        <div
          style={{
            marginTop: 18,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            opacity: loc,
            transform: `translateY(${(1 - loc) * 20}px)`,
            fontFamily: FONT_TEXT,
            fontWeight: 500,
            fontSize: 34,
            color: 'rgba(255,255,255,0.9)',
          }}
        >
          <Pin size={36} color={C.orange} />
          Goregaon, Mumbai
        </div>
      </div>
    </AbsoluteFill>
  );
};

const NAMES = ['Rahul Purohit', 'Raju Sahu', 'Suresh Sharma', 'Dayanand Dhali'];

export const TeamScene: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return (
    <SplitShot a={photo(39)} b={photo(31)} focusA="50% 40%" focusB="45% 40%">
      <div style={{height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 22}}>
        <Label text="Representing Meghdoot" delay={16} size={24} />
        <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: 40, rowGap: 14, width: 920}}>
          {NAMES.map((n, i) => {
            const s = spring({frame: frame - 26 - i * 10, fps, config: {damping: 15, stiffness: 150}});
            return (
              <div
                key={n}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: i % 2 === 0 ? 'flex-end' : 'flex-start',
                  gap: 14,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 800,
                  fontSize: 46,
                  color: C.white,
                  opacity: s,
                  transform: `translateY(${(1 - s) * 30}px) scale(${0.9 + 0.1 * s})`,
                }}
              >
                <div style={{width: 14, height: 14, borderRadius: 7, background: i % 2 === 0 ? C.orange : C.blue}} />
                {n}
              </div>
            );
          })}
        </div>
      </div>
    </SplitShot>
  );
};

// Three photo strips with the industry's everyday realities stacked on top.
export const Triptych: React.FC = () => {
  const frame = useCurrentFrame();
  const strips: [number, string, [number, number]][] = [
    [24, '50% 40%', [-30, 30]],
    [37, '50% 45%', [30, -30]],
    [20, '45% 45%', [-30, 30]],
  ];
  const w = (WIDTH - 12) / 3;
  const lines = ['HEAVY LIFTING.', 'SPECIALIZED TRANSPORT.', 'WORK AT HEIGHT.'];
  return (
    <AbsoluteFill style={{backgroundColor: C.orange}}>
      {strips.map(([n, focus, y], i) => {
        const p = interpolate(frame, [i * 5, i * 5 + 18], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
        return (
          <div
            key={n}
            style={{
              position: 'absolute',
              top: 0,
              left: i * (w + 6),
              width: w,
              height: HEIGHT,
              overflow: 'hidden',
              clipPath: `inset(${(1 - p) * 100}% 0 0 0)`,
            }}
          >
            <KenBurns src={photo(n)} focus={focus} kb={{from: 1.12, to: 1.2, y}} />
            <AbsoluteFill style={{backgroundColor: 'rgba(6,18,35,0.42)'}} />
          </div>
        );
      })}
      <AbsoluteFill style={{justifyContent: 'center', alignItems: 'center', gap: 18}}>
        {lines.map((l, i) => {
          const d = 15 + i * 15;
          const bar = interpolate(frame, [d, d + 10], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
          return (
            <div key={l} style={{position: 'relative', padding: '8px 26px'}}>
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'rgba(11,28,51,0.92)',
                  borderLeft: `8px solid ${i === 1 ? C.blue : C.orange}`,
                  transform: `scaleX(${bar})`,
                  transformOrigin: 'left',
                }}
              />
              <div style={{position: 'relative'}}>
                <RevealWords text={l} delay={d + 4} size={60} weight={900} accent={{}} />
              </div>
            </div>
          );
        })}
        <div style={{marginTop: 22}}>
          <RevealWords
            text="are part of our everyday operations"
            delay={66}
            stagger={2}
            size={36}
            weight={600}
            align="center"
            color="rgba(255,255,255,0.95)"
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Closing: React.FC = () => {
  const frame = useCurrentFrame();
  const under = interpolate(frame, [62, 84], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const quote = interpolate(frame, [4, 18], [0, 1], {...clamp, easing: Easing.out(Easing.back(2))});
  return (
    <AbsoluteFill>
      <PortraitShot n={photo(13)} kb={{from: 1.08, to: 1.2}} focus="50% 40%" />
      <AbsoluteFill style={{backgroundColor: 'rgba(6,18,35,0.72)'}} />
      <AbsoluteFill style={{justifyContent: 'center', padding: '0 80px', gap: 26}}>
        <svg
          width={110}
          height={86}
          viewBox="0 0 110 86"
          style={{transform: `scale(${quote})`, transformOrigin: 'left bottom'}}
        >
          <path
            fill={C.orange}
            d="M0 86V52C0 22 14 5 42 0l5 12C32 17 25 28 24 42h22v44H0zm60 0V52c0-30 14-47 42-52l5 12c-15 5-22 16-23 30h22v44H60z"
          />
        </svg>
        <RevealWords text="Because safety is not just a priority on site." delay={10} stagger={3} size={62} weight={700} lineHeight={1.12} />
        <RevealWords
          text="It is a commitment we continue to strengthen."
          delay={42}
          stagger={3}
          size={62}
          weight={900}
          lineHeight={1.12}
          accent={{commitment: C.orange, strengthen: C.orange}}
        />
        <div
          style={{
            height: 8,
            width: 360 * under,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${C.orangeDeep}, ${C.orange} 45%, ${C.blue})`,
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const EndCard: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const logo = spring({frame: frame - 14, fps, config: {damping: 16, stiffness: 110}});
  const line = interpolate(frame, [30, 52], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const tags = ['#MeghdootInfra', '#OSHIndia2026', '#SafetyFirst'];
  return (
    <AbsoluteFill>
      <LightBackdrop />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
        <div style={{width: 880, opacity: logo, transform: `scale(${0.85 + 0.15 * logo}) translateY(${(1 - logo) * 30}px)`}}>
          <Img src={staticFile('logo.png')} style={{width: '100%', display: 'block'}} />
        </div>
        <div
          style={{
            marginTop: 56,
            height: 6,
            width: 620 * line,
            borderRadius: 3,
            background: `linear-gradient(90deg, ${C.orangeDeep}, ${C.orange} 45%, ${C.blue})`,
          }}
        />
        <div style={{marginTop: 40, display: 'flex', gap: 22}}>
          {tags.map((t, i) => {
            const s = spring({frame: frame - 40 - i * 6, fps, config: {damping: 14}});
            return (
              <div
                key={t}
                style={{
                  padding: '10px 20px',
                  borderRadius: 999,
                  border: `2px solid ${i === 1 ? C.orange : C.blue}`,
                  color: i === 1 ? C.orangeDeep : C.blueDeep,
                  fontFamily: FONT_DISPLAY,
                  fontWeight: 700,
                  fontSize: 28,
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
          <Label text="OSH India 2026 · Goregaon, Mumbai" delay={58} color={C.grey} size={24} />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
