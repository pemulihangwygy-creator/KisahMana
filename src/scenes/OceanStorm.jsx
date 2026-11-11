import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Stars, Moon, Clouds, Rain} from '../components/Atmosphere.jsx';
import {wavePath} from '../theme.js';

export const OceanStorm = ({progress = 0, flashTimes = [], variant = 'long', calm = false}) => {
  const {f, t, W, H, k} = useScene();
  const horizon = H * (variant === 'short' ? 0.46 : 0.52);
  const bands = [
    {y: -10, amp: 12, speed: 22, color: '#0c1d2a', h: 150},
    {y: 60, amp: 18, speed: 40, color: '#091621', h: 220},
    {y: 160, amp: 24, speed: 62, color: '#060f18', h: 300},
    {y: 300, amp: 30, speed: 88, color: '#040b12', h: 420},
  ];
  const paths = useMemo(() => bands.map((b) => wavePath(W * 2, b.h * k, b.amp * k, b.y / 60)), [W, H, k]);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #05090f 0%, #071320 46%, #0a1a28 100%)'}}>
      <Stars count={calm ? 110 : 60} opacity={calm ? 0.8 : 0.45} maxY={horizon / H - 0.06} seed={2} />
      <Moon x={0.24} y={0.18} r={calm ? 96 * k : 64 * k} glow={calm ? 0.22 : 0.12} />
      <Clouds count={calm ? 3 : 5} seed={9} y={0.1} tint="8,16,24" opacity={calm ? 0.7 : 1} speed={calm ? 0.6 : 1.2} />
      <div
        style={{
          position: 'absolute',
          left: 0.24 * W - (calm ? 110 : 70) * k,
          top: horizon,
          width: (calm ? 220 : 140) * k,
          height: H - horizon,
          background: 'linear-gradient(180deg, rgba(214,238,228,0.16) 0%, rgba(214,238,228,0.03) 80%)',
          opacity: 0.65 + 0.25 * Math.sin(t * 0.7),
          transform: 'skewX(-3deg)',
        }}
      />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {bands.map((b, i) => (
          <g key={i} transform={`translate(${(-((f * b.speed) % W)).toFixed(1)} ${(horizon + b.y * k + Math.sin(t * 0.55 + i * 1.3) * 6 * k).toFixed(1)})`}>
            <path d={paths[i]} fill={b.color} />
          </g>
        ))}
      </svg>
      {!calm ? <Rain count={variant === 'short' ? 40 : 70} opacity={0.3} speed={1.15} /> : null}
      <AbsoluteFill
        style={{
          background: 'radial-gradient(ellipse at 50% 60%, rgba(80,200,140,0.05) 0%, rgba(80,200,140,0) 65%)',
          opacity: 0.6 + 0.4 * Math.sin(t * 0.35),
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};
