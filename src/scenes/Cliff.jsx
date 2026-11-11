import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Stars, Moon, Clouds} from '../components/Atmosphere.jsx';
import {WomanWind} from '../components/Silhouettes.jsx';
import {wavePath} from '../theme.js';

export const Cliff = ({progress = 0, flashTimes = [], variant = 'long', scene = {}, durationSec = 18}) => {
  const {f, t, W, H, k} = useScene();
  const horizon = H * 0.6;
  const bands = [
    {y: 0, amp: 10, speed: 18, color: '#0a1a26', h: 160},
    {y: 90, amp: 16, speed: 34, color: '#071320', h: 240},
    {y: 210, amp: 22, speed: 52, color: '#050d16', h: 360},
  ];
  const paths = useMemo(() => bands.map((b) => wavePath(W * 2, b.h * k, b.amp * k, b.y / 50)), [W, H, k]);
  const whisperAt = scene.whisperAt ?? 0.55;
  const wp = (progress - (whisperAt - 0.04)) / 0.3;
  const whisperOp = wp <= 0 || wp >= 1 ? 0 : Math.sin(Math.PI * wp);
  const s = k * 1.05;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #050a12 0%, #081522 52%, #0a1a28 100%)'}}>
      <Stars count={110} opacity={0.85} maxY={horizon / H - 0.05} seed={6} />
      <Moon x={0.68} y={0.2} r={104 * k} glow={0.28} />
      <Clouds count={3} seed={17} y={0.1} speed={0.4} opacity={0.6} />
      <div
        style={{
          position: 'absolute',
          left: 0.68 * W - 130 * k,
          top: horizon,
          width: 260 * k,
          height: H - horizon,
          background: 'linear-gradient(180deg, rgba(214,238,228,0.18) 0%, rgba(214,238,228,0.02) 85%)',
          opacity: 0.6 + 0.25 * Math.sin(t * 0.6),
          transform: 'skewX(-3deg)',
        }}
      />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {bands.map((b, i) => (
          <g key={i} transform={`translate(${(-((f * b.speed) % W)).toFixed(1)} ${(horizon + b.y * k + Math.sin(t * 0.5 + i) * 5 * k).toFixed(1)})`}>
            <path d={paths[i]} fill={b.color} />
          </g>
        ))}
        {/* tebing karang */}
        <path
          d={`M0 ${H} L0 ${H * 0.54} L${W * 0.1} ${H * 0.58} L${W * 0.18} ${H * 0.55} L${W * 0.26} ${H * 0.62} L${W * 0.33} ${H * 0.58} L${W * 0.4} ${H * 0.66} L${W * 0.47} ${H * 0.72} L${W * 0.5} ${H} Z`}
          fill="#05090e"
        />
        {/* rumput di tepi tebing */}
        {Array.from({length: 12}, (_, i) => {
          const gx = W * (0.04 + i * 0.036);
          const gy = H * (0.56 + ((i * 7919) % 97) / 97 * 0.1);
          return <path key={i} d={`M ${gx} ${gy} q ${6 * k} ${-16 * k} ${2 * k} ${-26 * k}`} stroke="#0a141c" strokeWidth={3 * k} fill="none" />;
        })}
        {/* perempuan di tepi tebing */}
        <g transform={`translate(${W * 0.3 - 100 * s} ${H * 0.62 - 424 * s}) scale(${s})`} fill="#03060a">
          <WomanWind hairSway={3.2 * Math.sin(t * 1.15)} />
        </g>
      </svg>
      {/* bisikan */}
      {whisperOp > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: H * 0.3,
            textAlign: 'center',
            fontFamily: '"Poppins", sans-serif',
            fontStyle: 'italic',
            fontWeight: 300,
            fontSize: 46 * k,
            letterSpacing: 3,
            color: `rgba(158,240,190,${0.9 * whisperOp})`,
            textShadow: `0 0 ${34 * k}px rgba(142,240,176,${0.5 * whisperOp}), 0 2px 12px rgba(0,0,0,0.8)`,
            transform: `translateY(${(1 - whisperOp) * 26 * k}px)`,
            pointerEvents: 'none',
          }}
        >
          “Datanglah, anakku. Laut ini akan menyembuhkanmu.”
        </div>
      ) : null}
    </AbsoluteFill>
  );
};
