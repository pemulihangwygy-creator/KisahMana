import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Moon, Clouds, Ripples} from '../components/Atmosphere.jsx';
import {wavePath} from '../theme.js';

export const CalmSea = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {f, t, W, H, k} = useScene();
  const horizon = H * 0.5;
  const bands = [
    {y: 20, amp: 4, speed: 7, color: '#0a1721', h: 200},
    {y: 220, amp: 6, speed: 11, color: '#071119', h: 420},
  ];
  const paths = useMemo(() => bands.map((b) => wavePath(W * 2, b.h * k, b.amp * k, b.y / 30)), [W, H, k]);
  const flashT = flashTimes[0] ?? null;
  const env = flashT != null ? Math.exp(-(((t - flashT) / 0.6) ** 2)) : 0;
  const burst = flashT != null ? Math.min(1, Math.max(0, (t - flashT) / 1.4)) : 0;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #070d13 0%, #0b151f 48%, #0d1b26 50%, #071119 100%)'}}>
      <Moon x={0.76} y={0.14} r={54 * k} glow={0.12} />
      <Clouds count={2} seed={23} y={0.08} speed={0.14} opacity={0.5} tint="12,20,28" />
      <div style={{position: 'absolute', left: 0, top: horizon - 1, right: 0, height: 2, background: 'rgba(170,210,195,0.1)'}} />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {bands.map((b, i) => (
          <g key={i} transform={`translate(${(-((f * b.speed) % W)).toFixed(1)} ${(horizon + b.y * k).toFixed(1)})`}>
            <path d={paths[i]} fill={b.color} />
          </g>
        ))}
      </svg>
      {/* cahaya hijau di bawah permukaan */}
      <div
        style={{
          position: 'absolute',
          left: W * 0.5 - 320 * k,
          top: H * 0.66 - 200 * k,
          width: 640 * k,
          height: 400 * k,
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(96,224,152,0.3) 0%, rgba(96,224,152,0.07) 45%, rgba(96,224,152,0) 70%)',
          opacity: Math.min(1, (0.42 + 0.38 * Math.sin(t * 0.32)) * (1 + env * 1.6)),
          transform: `scale(${1 + 0.05 * Math.sin(t * 0.32) + burst * 0.5})`,
        }}
      />
      <Ripples x={0.5} y={0.66} period={3.6} maxW={560 * k} maxOp={0.26} color="110,224,160" />
      {burst > 0 && burst < 1 ? (
        <div
          style={{
            position: 'absolute',
            left: W * 0.5 - (300 * k) * (1 + burst * 3),
            top: H * 0.66 - (60 * k) * (1 + burst * 3),
            width: 600 * k * (1 + burst * 3),
            height: 120 * k * (1 + burst * 3),
            borderRadius: '50%',
            border: `3px solid rgba(140,240,180,${(1 - burst) * 0.6})`,
          }}
        />
      ) : null}
      {env > 0.01 ? <AbsoluteFill style={{background: 'rgba(140,240,180,0.1)', opacity: env * 0.5, pointerEvents: 'none'}} /> : null}
    </AbsoluteFill>
  );
};
