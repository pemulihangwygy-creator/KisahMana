import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Stars, Moon, Clouds, Particles} from '../components/Atmosphere.jsx';
import {QueenFigure, WaveCrest} from '../components/Silhouettes.jsx';
import {wavePath} from '../theme.js';

export const QueenReveal = ({progress = 0, flashTimes = [], variant = 'long', durationSec = 18}) => {
  const {f, t, W, H, k} = useScene();
  const horizon = H * (variant === 'short' ? 0.5 : 0.55);
  const bands = [
    {y: 60, amp: 16, speed: 26, color: '#0a1a28', h: 220},
    {y: 260, amp: 24, speed: 48, color: '#061019', h: 420},
  ];
  const paths = useMemo(() => bands.map((b) => wavePath(W * 2, b.h * k, b.amp * k, b.y / 50)), [W, H, k]);
  const flashT = flashTimes[0] ?? null;
  const env = flashT != null ? Math.exp(-(((t - flashT) / 0.4) ** 2)) : 0;
  const q = k * (variant === 'short' ? 2.0 : 1.6);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #040910 0%, #071322 55%, #0a1a28 100%)'}}>
      <Stars count={80} opacity={0.6} maxY={horizon / H - 0.08} seed={14} />
      <Moon x={0.5} y={0.24} r={150 * k} glow={0.22} />
      <Clouds count={4} seed={29} y={0.06} speed={1.6} opacity={0.95} />
      {/* aura hijau di belakang ratu */}
      <div
        style={{
          position: 'absolute',
          left: W * 0.5 - 520 * k,
          top: horizon - 520 * k,
          width: 1040 * k,
          height: 1040 * k,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(110,231,170,0.25) 0%, rgba(110,231,170,0.06) 45%, rgba(110,231,170,0) 70%)',
          opacity: 0.7 + 0.3 * Math.sin(t * 1.2) + env * 0.8,
        }}
      />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {bands.map((b, i) => (
          <g key={i} transform={`translate(${(-((f * b.speed) % W)).toFixed(1)} ${(horizon + b.y * k).toFixed(1)})`}>
            <path d={paths[i]} fill={b.color} />
          </g>
        ))}
        {/* takhta ombak */}
        <g transform={`translate(${W * 0.5 - 260 * k * 2} ${horizon - 200 * k * 2 + 150 * k}) scale(${k * 2})`} fill="#081a28">
          <WaveCrest />
        </g>
        {/* Sang Ratu */}
        <g transform={`translate(${W * 0.5 - 95 * q} ${horizon + 60 * k - 404 * q}) scale(${q})`} fill="#040b12">
          <QueenFigure hairSway={2.6 * Math.sin(t * 0.95)} gemColor="rgba(142,240,176,0.95)" />
        </g>
      </svg>
      <Particles count={26} color="170,240,200" seed={33} opacity={0.5} speed={1.1} minSize={2} maxSize={5} />
      {env > 0.01 ? <AbsoluteFill style={{background: 'rgba(160,245,200,0.16)', opacity: env, pointerEvents: 'none'}} /> : null}
    </AbsoluteFill>
  );
};
