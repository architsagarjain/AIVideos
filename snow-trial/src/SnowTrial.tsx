import React from 'react';
import {CameraMotionBlur} from '@remotion/motion-blur';
import {AbsoluteFill, Easing, Img, Sequence, interpolate, random, staticFile, useCurrentFrame} from 'remotion';
import {C, CUT, DISPLAY, HEIGHT, SERIF, TOTAL_FRAMES, WIDTH} from './theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const snap = Easing.bezier(0.16, 1, 0.3, 1); // fast start, long settle
const inOut = Easing.bezier(0.7, 0, 0.3, 1);
const accel = Easing.in(Easing.cubic);
const back = Easing.out(Easing.back(1.5));

const ramp = (f: number, [a, b]: [number, number], [x, y]: [number, number], easing = snap) =>
  interpolate(f, [a, b], [x, y], {...clamp, easing});

const FullImg: React.FC<{src: string}> = ({src}) => (
  <Img src={staticFile(src)} style={{width: WIDTH, height: HEIGHT, objectFit: 'cover', display: 'block'}} />
);

// Words that slam in sideways with a skew (motion blur does the rest)
const slam = (f: number, from: number, dir: 1 | -1, dist = 900) => ({
  transform: `translateX(${ramp(f, [from, from + 12], [dir * dist, 0])}px) skewX(${ramp(f, [from, from + 12], [dir * -18, 0])}deg)`,
  opacity: interpolate(f, [from, from + 3], [0, 1], clamp),
});

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

const TornTag: React.FC<{text: string; w: number; h: number; size: number; bg?: string; color?: string; seed: string}> = ({
  text,
  w,
  h,
  size,
  bg = C.ink,
  color = C.crimson,
  seed,
}) => (
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

// ---------- Shot 1a: London street ----------
const Street: React.FC = () => {
  const f = useCurrentFrame();
  // Open tilted and tight on a lit window, snap back to the full street
  const scale = ramp(f, [0, 22], [2.7, 1.18]) - ramp(f, [22, 44], [0, 0.04], Easing.linear);
  const rot = ramp(f, [0, 22], [-16, -2.5]) + ramp(f, [22, 44], [0, 1.5], Easing.linear);
  const ox = ramp(f, [0, 22], [998, 560]);
  const oy = ramp(f, [0, 22], [1100, 1060]);
  // Exit: zoom through the small red window
  const through = interpolate(f, [32, 48], [1, 14], {...clamp, easing: accel});
  const red = interpolate(f, [40, 48], [0, 1], clamp);

  return (
    <AbsoluteFill style={{background: '#000', transformOrigin: '626px 1145px', transform: `scale(${through})`}}>
      <AbsoluteFill style={{transformOrigin: `${ox}px ${oy}px`, transform: `scale(${scale}) rotate(${rot}deg)`}}>
        <FullImg src="img/street.webp" />
      </AbsoluteFill>
      <AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 38%)'}} />
      <div style={{position: 'absolute', top: 300, width: WIDTH, textAlign: 'center', lineHeight: 0.92}}>
        <div style={{...slam(f, 4, 1), fontFamily: DISPLAY, fontWeight: 900, fontSize: 168, color: '#fff', letterSpacing: -2}}>
          LONDON
        </div>
        <div
          style={{
            ...slam(f, 10, -1),
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

// ---------- Shot 1b: inside the red window ----------
const CANDLE = {x: 656, y: 919};

const Room: React.FC = () => {
  const f = useCurrentFrame();
  const red = interpolate(f, [0, 10], [1, 0], clamp);
  // Arrive fast from the zoom-through, decelerate onto the bedside
  const sc = ramp(f, [0, 22], [1.9, 1.16]) - ramp(f, [22, 40], [0, 0.04], Easing.linear);
  const rot = ramp(f, [0, 22], [6, 0]);
  // Exit: dive into the candle flame, warm flash
  const dive = interpolate(f, [38, 50], [1, 9], {...clamp, easing: accel});
  const flash = interpolate(f, [42, 50], [0, 1], clamp);
  const track = ramp(f, [2, 30], [60, 14]);

  return (
    <AbsoluteFill style={{background: '#000', transformOrigin: `${CANDLE.x}px ${CANDLE.y}px`, transform: `scale(${dive})`}}>
      <AbsoluteFill style={{transformOrigin: `${CANDLE.x}px ${CANDLE.y}px`, transform: `scale(${sc}) rotate(${rot}deg)`}}>
        <FullImg src="img/room.webp" />
      </AbsoluteFill>
      <div
        style={{
          ...slam(f, 2, 1, 1100),
          position: 'absolute',
          top: 1380,
          width: WIDTH,
          textAlign: 'center',
          fontFamily: DISPLAY,
          fontWeight: 900,
          fontSize: 150,
          letterSpacing: track,
          color: '#fff',
          textShadow: '0 10px 40px rgba(0,0,0,0.8)',
        }}
      >
        CHOLERA
      </div>
      <AbsoluteFill style={{background: C.crimson, opacity: red}} />
      <AbsoluteFill style={{background: '#ffe2b0', opacity: flash}} />
    </AbsoluteFill>
  );
};

// ---------- Shot 2: portrait card dropped on the desk ----------
const CARD_W = 640;
const CARD_H = 922;

const Tape: React.FC<{src: string; x: number; y: number; rot: number; at: number; w: number}> = ({src, x, y, rot, at, w}) => {
  const f = useCurrentFrame();
  const k = ramp(f, [at, at + 6], [0, 1], back);
  return (
    <Img
      src={staticFile(src)}
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        opacity: interpolate(f, [at, at + 2], [0, 0.95], clamp),
        transform: `translate(-50%, -50%) rotate(${rot}deg) scale(${1.5 - 0.5 * k})`,
        filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.25))',
      }}
    />
  );
};

const Portrait: React.FC = () => {
  const f = useCurrentFrame();
  const flash = interpolate(f, [0, 10], [1, 0], clamp);
  // Card spins in showing its back, lands face up
  const ry = ramp(f, [0, 24], [-540, 0]);
  const rz = ramp(f, [0, 24], [-28, -5]) + ramp(f, [24, 66], [0, 1.5], Easing.linear);
  const ty = ramp(f, [0, 24], [-700, 0]);
  const sc = ramp(f, [0, 24], [1.5, 1]);
  const shadow = ramp(f, [10, 24], [90, 22]);
  const glint = interpolate(f, [26, 42], [-60, 160], {...clamp, easing: inOut});
  // Camera: slow push, slight drift
  const cam = ramp(f, [0, 66], [1.14, 1.02], Easing.out(Easing.quad));
  const tagX = ramp(f, [26, 38], [1100, 0]);
  const subX = ramp(f, [31, 43], [-1100, 0]);
  const face: React.CSSProperties = {position: 'absolute', inset: 0, backfaceVisibility: 'hidden', borderRadius: 18, overflow: 'hidden'};

  return (
    <AbsoluteFill style={{transform: `scale(${cam})`}}>
      <FullImg src="img/desk.webp" />
      <AbsoluteFill style={{perspective: 1800}}>
        <div
          style={{
            position: 'absolute',
            left: (WIDTH - CARD_W) / 2,
            top: 300,
            width: CARD_W,
            height: CARD_H,
            transform: `translateY(${ty}px) rotateZ(${rz}deg) scale(${sc})`,
            filter: `drop-shadow(${shadow * 0.35}px ${shadow}px ${shadow * 0.8}px rgba(10,12,14,0.6))`,
          }}
        >
          <div style={{position: 'absolute', inset: 0, transformStyle: 'preserve-3d', transform: `rotateY(${ry}deg)`}}>
            <div style={face}>
              <Img src={staticFile('img/card_front.png')} style={{width: CARD_W, height: CARD_H, display: 'block'}} />
              <div style={{position: 'absolute', inset: 0, mixBlendMode: 'screen'}}>
                <div
                  style={{
                    position: 'absolute',
                    top: -200,
                    left: `${glint}%`,
                    width: 200,
                    height: 1400,
                    transform: 'rotate(22deg)',
                    background: 'linear-gradient(90deg, rgba(255,255,255,0), rgba(255,240,220,0.5), rgba(255,255,255,0))',
                  }}
                />
              </div>
            </div>
            <div style={{...face, transform: 'rotateY(180deg)'}}>
              <Img src={staticFile('img/card_back.png')} style={{width: CARD_W, height: CARD_H, display: 'block'}} />
            </div>
          </div>
          <Tape src="img/tape1.png" x={40} y={30} rot={-38} at={24} w={300} />
          <Tape src="img/tape3.png" x={CARD_W - 30} y={CARD_H - 40} rot={-32} at={28} w={300} />
        </div>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1265, left: 150, transform: `translateX(${tagX}px) rotate(-4deg)`}}>
        <TornTag text="DR. JOHN SNOW" w={780} h={150} size={84} seed="name" />
      </div>
      <div style={{position: 'absolute', top: 1420, left: 330, transform: `translateX(${subX}px) rotate(2deg)`}}>
        <TornTag text="PHYSICIAN · LONDON" w={520} h={86} size={40} bg={C.cream} color={C.ink} seed="sub" />
      </div>
      <AbsoluteFill style={{background: '#ffe2b0', opacity: flash}} />
    </AbsoluteFill>
  );
};

// ---------- The map: shared by shots 3 and 4 ----------
const PUMP = {x: 538, y: 845};

// Death marks clustered around the pump, like Snow's map: stacks of short bars
const MARKS = (() => {
  const out: {x: number; y: number; n: number; rot: number; order: number}[] = [];
  for (let i = 0; i < 70; i++) {
    const near = random(`near${i}`) < 0.78;
    const ang = random(`a${i}`) * Math.PI * 2;
    const rad = near ? Math.sqrt(random(`r${i}`)) * 230 + 34 : 260 + random(`r${i}`) * 420;
    const x = PUMP.x + Math.cos(ang) * rad * 1.15;
    const y = PUMP.y + Math.sin(ang) * rad * 0.9;
    if (y > 1180 || y < 420 || x < 30 || x > 1050) continue;
    const n = near ? 1 + Math.floor(random(`n${i}`) * (rad < 140 ? 5 : 3)) : 1;
    out.push({x, y, n, rot: -18 + random(`t${i}`) * 10, order: random(`o${i}`)});
  }
  return out.sort((a, b) => a.order - b.order);
})();

const Marks: React.FC<{showUntil: number; start: number; end: number}> = ({showUntil, start, end}) => {
  const f = useCurrentFrame();
  return (
    <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
      {MARKS.map((m, i) => {
        const at = start + ((end - start) * i) / MARKS.length;
        if (f < at || i > showUntil) return null;
        const k = ramp(f, [at, at + 5], [0, 1], back);
        return (
          <g key={i} transform={`translate(${m.x} ${m.y}) rotate(${m.rot}) scale(${1.8 - 0.8 * k})`} opacity={Math.min(1, k * 1.5)}>
            {Array.from({length: m.n}).map((_, j) => (
              <rect key={j} x={-9} y={-j * 9 - 4} width={18} height={6} fill="#120c08" />
            ))}
          </g>
        );
      })}
    </svg>
  );
};

// ---------- Shot 3: marking the map ----------
const NIB = {x: 2, y: 838}; // nib tip inside hand.png
const HAND_SCALE = 0.55;

const MapShot: React.FC = () => {
  const f = useCurrentFrame();
  const r = interpolate(f, [0, 14], [0, 1500], {...clamp, easing: inOut});
  const rim = interpolate(f, [8, 14], [1, 0], clamp);
  const tx = ramp(f, [0, 76], [60, -60], Easing.linear);
  const rz = ramp(f, [0, 22], [-10, -4]) + ramp(f, [22, 76], [0, 2], Easing.linear);
  const sc = ramp(f, [0, 22], [1.55, 1.3]) + ramp(f, [22, 76], [0, 0.07], Easing.linear);
  const whip = interpolate(f, [64, 76], [0, -1400], {...clamp, easing: accel});
  const lineX = ramp(f, [2, 16], [1150, 60]) + ramp(f, [16, 76], [0, -560], Easing.linear);
  // Hand travels across the cluster, dipping to the paper
  const hx = PUMP.x + 260 * Math.sin(f / 9) - 40;
  const hy = PUMP.y + 120 * Math.cos(f / 7) + 40;
  const lift = 10 * Math.abs(Math.sin(f / 3));

  return (
    <AbsoluteFill style={{clipPath: `circle(${r}px at 540px 900px)`, transform: `translateX(${whip}px)`}}>
      <AbsoluteFill style={{background: '#0b0806', perspective: 1500}}>
        <AbsoluteFill style={{transformOrigin: `${PUMP.x}px ${PUMP.y}px`, transform: `translateX(${tx}px) rotateX(12deg) rotateZ(${rz}deg) scale(${sc})`}}>
          <FullImg src="img/map_clean.webp" />
          <Marks showUntil={999} start={4} end={60} />
          <Img
            src={staticFile('img/hand.png')}
            style={{
              position: 'absolute',
              left: hx - NIB.x * HAND_SCALE,
              top: hy - NIB.y * HAND_SCALE - lift,
              width: 1372 * HAND_SCALE,
              filter: `drop-shadow(${18 + lift}px ${26 + lift}px 18px rgba(0,0,0,0.55))`,
            }}
          />
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
          left: 540 - r,
          top: 900 - r,
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
// Hand-drawn circle: a wobbly loop that overshoots its start
const circlePath = (() => {
  const pts: string[] = [];
  for (let i = 0; i <= 64; i++) {
    const a = -Math.PI / 2 + (i / 64) * Math.PI * 2.15;
    const rr = 250 + 14 * Math.sin(i * 0.7) + 6 * Math.sin(i * 2.3);
    pts.push(`${(PUMP.x + Math.cos(a) * rr * 1.1).toFixed(1)},${(PUMP.y - 60 + Math.sin(a) * rr).toFixed(1)}`);
  }
  return `M ${pts.join(' L ')}`;
})();

const Pump: React.FC = () => {
  const f = useCurrentFrame();
  const enter = ramp(f, [0, 12], [1400, 0]);
  // Camera lowers toward the table and pushes in on the pump (speed ramp)
  const tilt = ramp(f, [6, 44], [12, 34], inOut) + ramp(f, [44, 162], [0, 3], Easing.linear);
  const sc = ramp(f, [6, 44], [1.35, 2.05], inOut) + ramp(f, [44, 162], [0, 0.2], Easing.linear);
  const rz = ramp(f, [0, 44], [6, -2], inOut);
  const draw = interpolate(f, [40, 56], [1, 0], {...clamp, easing: inOut});
  // Pump pops up out of the paper like a pop-up book
  const stand = ramp(f, [84, 100], [0, 1], back);
  const tagX = ramp(f, [102, 114], [-1200, 0]);
  // Rack focus out
  const blur = interpolate(f, [130, 156], [0, 16], {...clamp, easing: Easing.in(Easing.quad)});
  const dark = interpolate(f, [148, 162], [0, 1], clamp);
  const pulse = (start: number) => {
    const k = interpolate(f, [start, start + 24], [0, 1], clamp);
    return k > 0 && k < 1 ? (
      <ellipse cx={PUMP.x} cy={PUMP.y - 60} rx={(280 + 240 * snap(k)) * 1.1} ry={280 + 240 * snap(k)} fill="none" stroke={C.crimson} strokeWidth={10} opacity={1 - k} />
    ) : null;
  };
  const PW = 190;
  const PH = (1490 / 851) * PW;

  return (
    <AbsoluteFill style={{transform: `translateX(${enter}px)`, filter: `blur(${blur}px)`}}>
      <AbsoluteFill style={{background: '#0b0806', perspective: 1400}}>
        <AbsoluteFill
          style={{
            transformOrigin: `${PUMP.x}px ${PUMP.y}px`,
            transformStyle: 'preserve-3d',
            transform: `rotateX(${tilt}deg) rotateZ(${rz}deg) scale(${sc})`,
          }}
        >
          <FullImg src="img/map_clean.webp" />
          <Marks showUntil={999} start={-200} end={-100} />
          <svg width={WIDTH} height={HEIGHT} style={{position: 'absolute', inset: 0}}>
            <path d={circlePath} fill="none" stroke={C.crimson} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={draw} opacity={0.92} />
            {pulse(58)}
            {pulse(72)}
            <ellipse cx={PUMP.x + 20} cy={PUMP.y + 4} rx={150 * stand} ry={44 * stand} fill="rgba(0,0,0,0.45)" style={{filter: 'blur(10px)'}} />
          </svg>
          <Img
            src={staticFile('img/pump_cutout.png')}
            style={{
              position: 'absolute',
              left: PUMP.x - PW * 0.47,
              top: PUMP.y - PH + 10,
              width: PW,
              height: PH,
              transformOrigin: '50% 100%',
              transform: `rotateX(${-tilt * stand}deg)`,
              opacity: interpolate(f, [84, 87], [0, 1], clamp),
              filter: 'brightness(0.9) contrast(1.05)',
            }}
          />
        </AbsoluteFill>
      </AbsoluteFill>
      <div style={{position: 'absolute', top: 1500, left: 70, transform: `translateX(${tagX}px) rotate(-3deg)`}}>
        <TornTag text="BROAD STREET PUMP" w={940} h={150} size={70} seed="pump" />
      </div>
      <AbsoluteFill style={{background: '#000', opacity: dark}} />
    </AbsoluteFill>
  );
};

// ---------- Finishing layers ----------
const Grain: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <AbsoluteFill style={{opacity: 0.12, mixBlendMode: 'overlay', pointerEvents: 'none'}}>
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
    <CameraMotionBlur shutterAngle={200} samples={8}>
      <AbsoluteFill>
        <Sequence from={CUT.street} durationInFrames={48}>
          <Street />
        </Sequence>
        <Sequence from={CUT.room} durationInFrames={CUT.portrait - CUT.room}>
          <Room />
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
