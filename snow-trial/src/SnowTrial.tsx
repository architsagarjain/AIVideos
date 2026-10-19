import React from 'react';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {C, CUT, DISPLAY, HEIGHT, SERIF, TOTAL_FRAMES, WIDTH} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const snap = Easing.bezier(0.16, 1, 0.3, 1); // fast start, long settle
const inOut = Easing.bezier(0.7, 0, 0.3, 1);
const accel = Easing.in(Easing.cubic);
const back = Easing.out(Easing.back(1.6));

const ramp = (f: number, [a, b]: [number, number], [x, y]: [number, number], easing = snap) =>
  interpolate(f, [a, b], [x, y], {...clamp, easing});

const FullImg: React.FC<{src: string}> = ({src}) => (
  <Img src={staticFile(src)} style={{width: WIDTH, height: HEIGHT, objectFit: 'cover', display: 'block'}} />
);

// Jagged torn-paper rectangle, deterministic per seed
const tornPath = (w: number, h: number, seed: string) => {
  const pts: string[] = [];
  const edge = (n: number, fn: (t: number, j: number) => [number, number]) => {
    for (let i = 0; i <= n; i++) {
      const j = (random(`${seed}-${pts.length}`) - 0.5) * 14;
      const [x, y] = fn(i / n, j);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
  };
  edge(26, (t, j) => [t * w, 8 + j * 0.6]);
  edge(5, (t, j) => [w - 8 + j * 0.8, t * h]);
  edge(26, (t, j) => [(1 - t) * w, h - 8 + j * 0.6]);
  edge(5, (t, j) => [8 + j * 0.8, (1 - t) * h]);
  return pts.join(' ');
};

const TornTag: React.FC<{
  text: string;
  w: number;
  h: number;
  size: number;
  bg?: string;
  color?: string;
  seed: string;
}> = ({text, w, h, size, bg = C.ink, color = C.crimson, seed}) => (
  <div style={{position: 'relative', width: w, height: h, filter: 'drop-shadow(0 14px 18px rgba(0,0,0,0.45))'}}>
    <svg width={w} height={h} style={{position: 'absolute', inset: 0}}>
      <polygon points={tornPath(w, h, seed)} fill={bg} />
    </svg>
    <div
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: DISPLAY,
        fontWeight: 900,
        fontSize: size,
        letterSpacing: 2,
        color,
      }}
    >
      {text}
    </div>
  </div>
);

// ---------- Shot 1: London street ----------
const Street: React.FC = () => {
  const f = useCurrentFrame();
  // Open tilted and tight on a lit window, snap back to the full street
  const scale = ramp(f, [0, 26], [2.7, 1.18]) - ramp(f, [26, 80], [0, 0.06], Easing.linear);
  const rot = ramp(f, [0, 26], [-16, -2.5]) + ramp(f, [26, 80], [0, 2.5], Easing.linear);
  const ox = ramp(f, [0, 26], [998, 560]);
  const oy = ramp(f, [0, 26], [1100, 1060]);
  // Exit: zoom through the small red window
  const through = interpolate(f, [72, 92], [1, 14], {...clamp, easing: accel});
  const red = interpolate(f, [80, 90], [0, 1], clamp);

  const word = (from: number, dir: 1 | -1) => ({
    transform: `translateX(${ramp(f, [from, from + 12], [dir * 900, 0])}px) skewX(${ramp(f, [from, from + 12], [dir * -18, 0])}deg)`,
    opacity: interpolate(f, [from, from + 3], [0, 1], clamp),
  });

  return (
    <AbsoluteFill style={{background: '#000', transformOrigin: '626px 1145px', transform: `scale(${through})`}}>
      <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `scale(${scale}) rotate(${rot}deg)`}}>
        <FullImg src="img/street.webp" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%)'}} />
      <div style={{position: 'absolute', top: 300, width: WIDTH, textAlign: 'center', lineHeight: 0.92}}>
        <div style={{...word(8, 1), fontFamily: DISPLAY, fontWeight: 900, fontSize: 168, color: '#fff', letterSpacing: -2}}>
          LONDON
        </div>
        <div
          style={{
            ...word(14, -1),
            fontFamily: SERIF,
            fontStyle: 'italic',
            fontWeight: 700,
            fontSize: 150,
            color: C.crimson,
            textShadow: '0 8px 30px rgba(0,0,0,0.6)',
          }}
        >
          1854
        </div>
      </div>
      <AbsoluteFill style={{background: C.crimson, opacity: red}} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: portrait card on graph paper ----------
const GraphPaper: React.FC = () => (
  <AbsoluteFill
    style={{
      backgroundColor: C.paper,
      backgroundImage: [
        'radial-gradient(ellipse at 30% 20%, rgba(255,255,255,0.55), rgba(255,255,255,0) 60%)',
        'linear-gradient(rgba(70,82,94,0.16) 2px, transparent 2px)',
        'linear-gradient(90deg, rgba(70,82,94,0.16) 2px, transparent 2px)',
        'linear-gradient(rgba(70,82,94,0.08) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(70,82,94,0.08) 1px, transparent 1px)',
      ].join(','),
      backgroundSize: '100% 100%, 270px 270px, 270px 270px, 54px 54px, 54px 54px',
    }}
  />
);

const Portrait: React.FC = () => {
  const f = useCurrentFrame();
  const fadeIn = interpolate(f, [0, 6], [0, 1], clamp);
  const redFlash = interpolate(f, [0, 10], [1, 0], clamp);
  // Card flips in, drops and settles
  const ry = ramp(f, [2, 22], [-88, 0], back);
  const rz = ramp(f, [2, 22], [-20, -5]) + ramp(f, [22, 66], [0, 2], Easing.linear);
  const ty = ramp(f, [2, 22], [-420, 0]);
  const sc = ramp(f, [2, 22], [1.35, 1]) + ramp(f, [22, 66], [0, 0.04], Easing.linear);
  const shadow = ramp(f, [8, 22], [90, 24]);
  const glint = interpolate(f, [16, 34], [-120, 220], {...clamp, easing: inOut});
  // Camera
  const cam = ramp(f, [0, 66], [1.12, 1.0], Easing.out(Easing.quad));
  // Torn name tag
  const tagX = ramp(f, [20, 32], [1100, 0]);
  const subX = ramp(f, [25, 37], [-1100, 0]);

  return (
    <AbsoluteFill style={{opacity: fadeIn, transform: `scale(${cam})`}}>
      <GraphPaper />
      <AbsoluteFill style={{background: 'linear-gradient(125deg, rgba(255,255,255,0) 30%, rgba(255,255,255,0.35) 45%, rgba(255,255,255,0) 60%)'}} />
      <AbsoluteFill style={{perspective: 1800}}>
        <div
          style={{
            position: 'absolute',
            left: (WIDTH - 640) / 2,
            top: 360,
            width: 640,
            height: 960,
            transform: `translateY(${ty}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${sc})`,
            filter: `drop-shadow(${shadow * 0.4}px ${shadow}px ${shadow * 0.9}px rgba(20,25,30,0.55))`,
          }}
        >
          <Img src={staticFile('img/card.png')} style={{width: 640, height: 960, display: 'block'}} />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              borderRadius: 22,
              overflow: 'hidden',
              mixBlendMode: 'screen',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: -200,
                left: `${glint}%`,
                width: 220,
                height: 1400,
                transform: 'rotate(22deg)',
                background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.55), rgba(255,255,255,0))',
              }}
            />
          </div>
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1250, left: 150, transform: `translateX(${tagX}px) rotate(-4deg)`}}>
        <TornTag text="DR. JOHN SNOW" w={760} h={150} size={84} seed="name" />
      </div>
      <div style={{position: 'absolute', top: 1405, left: 330, transform: `translateX(${subX}px) rotate(2deg)`}}>
        <TornTag text="PHYSICIAN · LONDON" w={520} h={86} size={40} bg={C.cream} color={C.ink} seed="sub" />
      </div>
      <AbsoluteFill style={{background: C.crimson, opacity: redFlash}} />
    </AbsoluteFill>
  );
};

// ---------- Shot 3: the map ----------
const MapShot: React.FC = () => {
  const f = useCurrentFrame();
  // Circle reveal from the pen tip
  const r = interpolate(f, [0, 14], [0, 1500], {...clamp, easing: inOut});
  const rim = interpolate(f, [8, 14], [1, 0], clamp);
  // Tilted 3D glide
  const tx = ramp(f, [0, 76], [70, -90], Easing.linear);
  const rz = ramp(f, [0, 20], [-9, -4]) + ramp(f, [20, 76], [0, 2], Easing.linear);
  const sc = ramp(f, [0, 20], [1.5, 1.32]) + ramp(f, [20, 76], [0, 0.06], Easing.linear);
  // Whip out to the left
  const whip = interpolate(f, [64, 76], [0, -1400], {...clamp, easing: accel});
  // Kinetic line: slams in, then drifts so "MARKED." sits centre when spoken
  const lineX = ramp(f, [2, 16], [1150, 60]) + ramp(f, [16, 76], [0, -560], Easing.linear);

  return (
    <AbsoluteFill style={{clipPath: `circle(${r}px at 600px 940px)`, transform: `translateX(${whip}px)`}}>
      <AbsoluteFill style={{background: '#0b0806', perspective: 1500}}>
        <AbsoluteFill
          style={{
            transformOrigin: '600px 940px',
            transform: `translateX(${tx}px) rotateX(16deg) rotateZ(${rz}deg) scale(${sc})`,
          }}
        >
          <FullImg src="img/map.webp" />
        </AbsoluteFill>
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 32%)'}} />
      <div
        style={{
          position: 'absolute',
          top: 230,
          left: 0,
          whiteSpace: 'nowrap',
          transform: `translateX(${lineX}px)`,
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: -2,
          color: '#fff',
          textShadow: '0 10px 30px rgba(0,0,0,0.7)',
        }}
      >
        EVERY DEATH, <span style={{color: C.crimson}}>MARKED.</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 600 - r,
          top: 940 - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          boxShadow: `inset 0 0 0 14px rgba(210,43,43,${rim})`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Shot 4: the pump ----------
const PUMP = {x: 637, y: 998};

const Pump: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ramp(f, [0, 12], [1400, 0]);
  // Speed-ramped push into the circle
  const sc = ramp(f, [8, 40], [1.08, 1.62], inOut) + ramp(f, [40, 162], [0, 0.16], Easing.linear);
  const rz = ramp(f, [0, 40], [5, -1.5], inOut) + ramp(f, [40, 162], [0, -1.5], Easing.linear);
  const rx = ramp(f, [0, 40], [14, 6], inOut);
  // Rack focus out at the end
  const blur = interpolate(f, [128, 156], [0, 16], {...clamp, easing: Easing.in(Easing.quad)});
  const dark = interpolate(f, [148, 162], [0, 1], clamp);
  // Pulse rings on "single place" and the tag on "water pump"
  const ring = (start: number) => {
    const k = interpolate(f, [start, start + 26], [0, 1], clamp);
    return k > 0 && k < 1 ? (
      <circle cx={PUMP.x} cy={PUMP.y} r={300 + 280 * snap(k)} fill="none" stroke={C.crimson} strokeWidth={12} opacity={1 - k} />
    ) : null;
  };
  const tagX = ramp(f, [82, 94], [-1200, 0]);
  const arrow = interpolate(f, [86, 100], [1, 0], {...clamp, easing: inOut});

  return (
    <AbsoluteFill style={{transform: `translateX(${enter}px)`, filter: `blur(${blur}px)`}}>
      <AbsoluteFill style={{background: '#0b0806', perspective: 1600}}>
        <AbsoluteFill style={{transformOrigin: `${PUMP.x}px ${PUMP.y}px`, transform: `rotateX(${rx}deg) rotateZ(${rz}deg) scale(${sc})`}}>
          <FullImg src="img/pump.webp" />
          <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
            {ring(46)}
            {ring(64)}
          </svg>
        </AbsoluteFill>
      </AbsoluteFill>
      <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
        <path
          d="M 300 1440 C 260 1330, 330 1230, 470 1200"
          fill="none"
          stroke={C.cream}
          strokeWidth={9}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={arrow}
        />
        <path
          d="M 430 1172 L 478 1198 L 440 1238"
          fill="none"
          stroke={C.cream}
          strokeWidth={9}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={arrow < 0.05 ? 1 : 0}
        />
      </svg>
      <div style={{position: 'absolute', top: 1470, left: 90, transform: `translateX(${tagX}px) rotate(-3deg)`}}>
        <TornTag text="BROAD STREET PUMP" w={900} h={150} size={78} seed="pump" />
      </div>
      <AbsoluteFill style={{background: '#000', opacity: dark}} />
    </AbsoluteFill>
  );
};

// ---------- Finishing layers ----------
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: 0.13, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
      <svg width={WIDTH} height={HEIGHT}>
        <filter id="g">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width={WIDTH} height={HEIGHT} filter="url(#g)" />
      </svg>
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 50%, rgba(0,0,0,0) 55%, rgba(0,0,0,0.5) 100%)', pointerEvents: 'none'}} />
);

export const SnowTrial: React.FC = () => (
  <AbsoluteFill style={{background: '#000'}}>
    <CameraMotionBlur shutterAngle={200} samples={10}>
      <AbsoluteFill>
        <Sequence from={CUT.street} durationInFrames={92}>
          <Street />
        </Sequence>
        <Sequence from={CUT.portrait} durationInFrames={66}>
          <Portrait />
        </Sequence>
        <Sequence from={CUT.map} durationInFrames={76}>
          <MapShot />
        </Sequence>
        <Sequence from={CUT.pump} durationInFrames={TOTAL_FRAMES - CUT.pump}>
          <Pump />
        </Sequence>
      </AbsoluteFill>
    </CameraMotionBlur>
    <Vignette />
    <Grain />
  </AbsoluteFill>
);
