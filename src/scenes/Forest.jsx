import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Rain} from '../components/Atmosphere.jsx';
import {Walker} from '../components/Silhouettes.jsx';
import {mulberry32} from '../theme.js';

const BANDS = [
  {baseY: 0.66, color: '#0d1721', w: 0.011, hMin: 0.5, hMax: 0.75, n: 9},
  {baseY: 0.76, color: '#091019', w: 0.016, hMin: 0.6, hMax: 0.85, n: 7},
  {baseY: 0.88, color: '#05090f', w: 0.022, hMin: 0.7, hMax: 0.95, n: 5},
];

export const Forest = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {t, W, H, k} = useScene();
  const trees = useMemo(() => {
    const rnd = mulberry32(21);
    const arr = [];
    BANDS.forEach((band, bi) => {
      for (let i = 0; i < band.n; i++) {
        arr.push({
          band: bi,
          x: (i + 0.15 + rnd() * 0.7) / band.n,
          w: band.w * (0.7 + rnd() * 0.6),
          lean: (rnd() - 0.5) * 0.14,
          h: band.hMin + rnd() * (band.hMax - band.hMin),
          br: rnd() * 6.28,
        });
      }
    });
    return arr;
  }, []);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #0a121b 0%, #101c26 60%, #0a141d 100%)'}}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {trees.map((tr, i) => {
          const band = BANDS[tr.band];
          const baseY = H * band.baseY;
          const hh = H * tr.h * 0.55;
          const x = tr.x * W;
          const wt = tr.w * W;
          const topX = x + tr.lean * hh;
          return (
            <g key={i} fill={band.color}>
              <path d={`M ${x - wt} ${baseY} L ${topX - wt * 0.35} ${baseY - hh} L ${topX + wt * 0.35} ${baseY - hh} L ${x + wt} ${baseY} Z`} />
              <path
                d={`M ${topX} ${baseY - hh * 0.45} L ${topX + wt * 3.2} ${baseY - hh * 0.62} L ${topX + wt * 3.4} ${baseY - hh * 0.55} L ${topX + wt * 0.3} ${baseY - hh * 0.4} Z`}
                opacity={0.85}
              />
              <path
                d={`M ${topX} ${baseY - hh * 0.62} L ${topX - wt * 2.6} ${baseY - hh * 0.8} L ${topX - wt * 2.8} ${baseY - hh * 0.73} L ${topX - wt * 0.3} ${baseY - hh * 0.58} Z`}
                opacity={0.85}
              />
            </g>
          );
        })}
        {/* tanah & jalan setapak */}
        <path d={`M0 ${H * 0.86} L${W} ${H * 0.84} L${W} ${H} L0 ${H} Z`} fill="#060b11" />
        <ellipse cx={W * 0.5} cy={H * 0.97} rx={W * 0.4} ry={H * 0.09} fill="#101d29" opacity={0.5} />
        {/* pejalan */}
        <g transform={`translate(${W * (0.28 + progress * 0.2) - 45 * k * 1.1} ${H * 0.7 - 200 * k * 1.1 - Math.abs(Math.sin(t * 4.2)) * 7 * k}) scale(${k * 1.1})`} fill="#04080d">
          <Walker step={13 * Math.sin(t * 4.2)} />
        </g>
      </svg>
      <Rain count={variant === 'short' ? 34 : 60} opacity={0.18} speed={0.8} />
    </AbsoluteFill>
  );
};
