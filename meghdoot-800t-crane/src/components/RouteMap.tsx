import React from 'react';
import {getLength, getPointAtLength, getTangentAtLength} from '@remotion/paths';
import {Easing, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, CARD, FONT_DISPLAY} from '../theme';
import {Card, Header, Page} from './Photo';
import {Caption, Label, RevealWords} from './Text';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

// Schematic, not to scale: Jamnagar sits west, Badnawar east and slightly north.
const MAP_W = CARD.w;
const MAP_TOP = 290;
const MAP_H = 760;
const FROM = {x: 170, y: 500};
const TO = {x: 840, y: 360};
const ROUTE = `M${FROM.x},${FROM.y} C300,650 430,320 560,440 S760,330 ${TO.x},${TO.y}`;
const LEN = getLength(ROUTE);

const DRIVE_START = 22;
const DRIVE_END = 132;

const PinMark: React.FC<{x: number; y: number; color: string; appear: number}> = ({x, y, color, appear}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const s = spring({frame: frame - appear, fps, config: {damping: 11, stiffness: 160}});
  const pulse = ((frame - appear) % 40) / 40;
  return (
    <g transform={`translate(${x} ${y})`}>
      {frame > appear && <circle r={18 + pulse * 46} fill="none" stroke={color} strokeWidth={4} opacity={(1 - pulse) * 0.6} />}
      <g transform={`scale(${s})`}>
        <circle r={26} fill={color} />
        <circle r={10} fill={C.white} />
      </g>
    </g>
  );
};

const PlaceLabel: React.FC<{x: number; y: number; name: string; state: string; appear: number; align: 'start' | 'end'}> = ({
  x,
  y,
  name,
  state,
  appear,
  align,
}) => {
  const frame = useCurrentFrame();
  const p = interpolate(frame, [appear, appear + 14], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <g opacity={p} transform={`translate(0 ${(1 - p) * 16})`}>
      <text x={x} y={y} textAnchor={align} fontFamily={FONT_DISPLAY} fontWeight={900} fontSize={44} fill={C.ink}>
        {name}
      </text>
      <text x={x} y={y + 40} textAnchor={align} fontFamily={FONT_DISPLAY} fontWeight={600} fontSize={28} fill={C.muted}>
        {state}
      </text>
    </g>
  );
};

// Side view of a tractor pulling a low-bed trailer.
const Truck: React.FC = () => (
  <g>
    <rect x={-66} y={-20} width={86} height={14} rx={3} fill={C.blue} />
    <rect x={-58} y={-34} width={52} height={14} rx={4} fill="#F7B267" />
    <path d="M20,-6 L20,-30 Q20,-36 26,-36 L44,-36 Q52,-36 56,-26 L62,-14 L62,-6 Z" fill={C.orange} />
    <rect x={30} y={-31} width={16} height={10} rx={2} fill={C.white} opacity={0.9} />
    {[-56, -40, -24, 30, 52].map((cx) => (
      <circle key={cx} cx={cx} cy={-2} r={7} fill={C.ink} />
    ))}
  </g>
);

export const RouteMap: React.FC = () => {
  const frame = useCurrentFrame();
  const t = interpolate(frame, [DRIVE_START, DRIVE_END], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const at = Math.max(0.5, LEN * t);
  const pt = getPointAtLength(ROUTE, at) ?? FROM;
  const tan = getTangentAtLength(ROUTE, at) ?? {x: 1, y: 0};
  const angle = (Math.atan2(tan.y, tan.x) * 180) / Math.PI;
  const states = interpolate(frame, [6, 26], [0, 1], clamp);
  const zoom = interpolate(frame, [0, 240], [1.0, 1.05]);
  const badge = spring({frame: frame - DRIVE_END - 6, fps: 30, config: {damping: 12}});

  return (
    <Page>
      <Header />
      <div style={{position: 'absolute', left: 48, top: 156, display: 'flex', flexDirection: 'column', gap: 6}}>
        <Label text="The route" delay={4} />
        <RevealWords text="Jamnagar to Badnawar" delay={8} size={68} weight={900} accent={{Badnawar: C.blue, Jamnagar: C.orange}} />
      </div>
      <Card x={CARD.x} y={MAP_TOP} w={MAP_W} h={MAP_H}>
        <svg width={MAP_W} height={MAP_H} viewBox={`0 0 ${MAP_W} ${MAP_H}`} style={{transform: `scale(${zoom})`}}>
          <defs>
            <pattern id="dots" width={28} height={28} patternUnits="userSpaceOnUse">
              <circle cx={2} cy={2} r={2} fill={C.hairline} />
            </pattern>
            <linearGradient id="route" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0%" stopColor={C.orange} />
              <stop offset="100%" stopColor={C.blue} />
            </linearGradient>
            <radialGradient id="guj">
              <stop offset="0%" stopColor="rgba(241,104,43,0.16)" />
              <stop offset="100%" stopColor="rgba(241,104,43,0)" />
            </radialGradient>
            <radialGradient id="mp">
              <stop offset="0%" stopColor="rgba(5,133,195,0.16)" />
              <stop offset="100%" stopColor="rgba(5,133,195,0)" />
            </radialGradient>
          </defs>
          <rect width={MAP_W} height={MAP_H} fill={C.white} />
          <rect width={MAP_W} height={MAP_H} fill="url(#dots)" />
          <g opacity={states}>
            <ellipse cx={230} cy={470} rx={330} ry={300} fill="url(#guj)" />
            <ellipse cx={790} cy={340} rx={360} ry={320} fill="url(#mp)" />
            <path d="M500,40 C470,180 540,260 500,380 S470,560 520,680" fill="none" stroke={C.muted} strokeOpacity={0.35} strokeWidth={3} strokeDasharray="4 12" strokeLinecap="round" />
            <text x={90} y={130} fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={30} letterSpacing={8} fill={C.orange} opacity={0.75}>
              GUJARAT
            </text>
            <text x={930} y={640} textAnchor="end" fontFamily={FONT_DISPLAY} fontWeight={800} fontSize={30} letterSpacing={8} fill={C.blue} opacity={0.75}>
              MADHYA PRADESH
            </text>
          </g>
          {/* full route, faint */}
          <path d={ROUTE} fill="none" stroke={C.hairline} strokeWidth={14} strokeLinecap="round" />
          {/* travelled route */}
          <path
            d={ROUTE}
            fill="none"
            stroke="url(#route)"
            strokeWidth={14}
            strokeLinecap="round"
            strokeDasharray={`${LEN} ${LEN}`}
            strokeDashoffset={LEN * (1 - t)}
          />
          <path d={ROUTE} fill="none" stroke={C.white} strokeWidth={3} strokeDasharray="14 18" opacity={0.9} />
          <PinMark x={FROM.x} y={FROM.y} color={C.orange} appear={8} />
          <PinMark x={TO.x} y={TO.y} color={C.blue} appear={DRIVE_END - 4} />
          <PlaceLabel x={FROM.x - 40} y={FROM.y + 80} name="JAMNAGAR" state="Gujarat" appear={12} align="start" />
          <PlaceLabel x={TO.x + 50} y={TO.y - 104} name="BADNAWAR" state="Madhya Pradesh" appear={DRIVE_END - 2} align="end" />
          {frame >= DRIVE_START - 4 && (
            <g transform={`translate(${pt.x} ${pt.y}) rotate(${angle}) translate(0 -14)`}>
              <Truck />
            </g>
          )}
        </svg>
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 34,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              padding: '12px 26px',
              borderRadius: 999,
              background: `linear-gradient(90deg, ${C.orange}, ${C.blue})`,
              color: C.white,
              fontFamily: FONT_DISPLAY,
              fontWeight: 800,
              fontSize: 28,
              letterSpacing: '0.14em',
              transform: `scale(${badge})`,
              boxShadow: '0 12px 30px rgba(29,36,51,0.2)',
            }}
          >
            800 TON CRANE · HEAVY HAULAGE
          </div>
        </div>
      </Card>
      <Caption
        label="Gujarat → Madhya Pradesh"
        text="A carefully planned heavy haulage operation"
        accent={{planned: C.orange, haulage: C.blue}}
        top={MAP_TOP + MAP_H + 44}
      />
    </Page>
  );
};
