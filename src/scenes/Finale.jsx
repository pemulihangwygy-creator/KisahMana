import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Stars, Moon, Clouds, Rain} from '../components/Atmosphere.jsx';
import {Walker} from '../components/Silhouettes.jsx';
import {wavePath} from '../theme.js';

export const Finale = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {f, t, W, H, k} = useScene();
  const horizon = H * 0.55;
  const bands = [
    {y: 0, amp: 12, speed: 20, color: '#0b1c29', h: 160},
    {y: 110, amp: 18, speed: 36, color: '#081521', h: 260},
  ];
  const paths = useMemo(() => bands.map((b) => wavePath(W * 2, b.h * k, b.amp * k, b.y / 40)), [W, H, k]);
  const advance = 90 * k - progress * 170 * k;
  const s = k * 0.5;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #05090f 0%, #071322 50%, #0a1a28 100%)'}}>
      <Stars count={70} opacity={0.6} maxY={horizon / H - 0.06} seed={12} />
      <Moon x={0.28} y={0.16} r={92 * k} glow={0.24} />
      <Clouds count={4} seed={19} y={0.08} speed={1.4} opacity={0.9} />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <defs>
          <linearGradient id="bigWave" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#123044" />
            <stop offset="100%" stopColor="#050f18" />
          </linearGradient>
        </defs>
        {bands.map((b, i) => (
          <g key={i} transform={`translate(${(-((f * b.speed) % W)).toFixed(1)} ${(horizon + b.y * k).toFixed(1)})`}>
            <path d={paths[i]} fill={b.color} />
          </g>
        ))}
        {/* ombak raksasa */}
        <g transform={`translate(${advance} 0)`}>
          <path
            d={`M ${W * 0.5} ${H} C ${W * 0.56} ${H * 0.62} ${W * 0.66} ${H * 0.34} ${W * 0.8} ${H * 0.22} C ${W * 0.88} ${H * 0.15} ${W * 0.95} ${H * 0.18} ${W * 0.98} ${H * 0.27} C ${W * 0.92} ${H * 0.24} ${W * 0.88} ${H * 0.28} ${W * 0.86} ${H * 0.35} C ${W * 0.92} ${H * 0.52} ${W * 0.97} ${H * 0.72} ${W} ${H * 0.82} L ${W} ${H} Z`}
            fill="url(#bigWave)"
          />
          <path
            d={`M ${W * 0.52} ${H * 0.74} C ${W * 0.6} ${H * 0.44} ${W * 0.68} ${H * 0.3} ${W * 0.8} ${H * 0.23}`}
            fill="none"
            stroke="rgba(200,240,220,0.3)"
            strokeWidth={5 * k}
          />
          <ellipse cx={W * 0.8} cy={H * 0.36} rx={260 * k} ry={200 * k} fill="rgba(110,240,170,0.16)" opacity={0.6 + 0.4 * Math.sin(t * 1.1)} />
        </g>
        {/* siluet manusia kecil di tepi air */}
        <g transform={`translate(${W * 0.17 - 45 * s * 2} ${H * 0.87 - 200 * s * 2}) scale(${s * 2})`} fill="#04080d">
          <Walker step={0} />
        </g>
      </svg>
      <Rain count={variant === 'short' ? 50 : 90} opacity={0.3} speed={1.2} />
    </AbsoluteFill>
  );
};
