import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {LightShafts, Particles} from '../components/Atmosphere.jsx';
import {mulberry32} from '../theme.js';

export const Palace = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {t, W, H, k} = useScene();
  const fish = useMemo(() => {
    const rnd = mulberry32(66);
    return Array.from({length: 4}, () => ({x0: rnd(), y: 0.18 + rnd() * 0.4, v: 24 + rnd() * 40, s: 0.5 + rnd() * 0.8, dir: rnd() > 0.5 ? 1 : -1, ph: rnd() * 6.28}));
  }, []);
  const windows = useMemo(() => {
    const rnd = mulberry32(67);
    return [-2, -1, 1, 2].map((i) => ({i, ph: rnd() * 6.28})).concat([{i: 0, ph: rnd() * 6.28}]);
  }, []);
  const towerTop = (x, w, y) => `M ${x} ${y} L ${x + w * 0.1} ${y - 52 * k} L ${x + w * 0.28} ${y - 18 * k} L ${x + w * 0.5} ${y - 70 * k} L ${x + w * 0.72} ${y - 18 * k} L ${x + w * 0.9} ${y - 52 * k} L ${x + w} ${y} Z`;
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #04141d 0%, #072735 40%, #041824 75%, #020c12 100%)'}}>
      <LightShafts count={4} seed={3} />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {/* gerbang kembar */}
        <g fill="#03141d">
          <path d={towerTop(W * 0.3, 120 * k, H * 0.42)} />
          <path d={towerTop(W * 0.7 - 120 * k, 120 * k, H * 0.42)} />
          <rect x={W * 0.3} y={H * 0.42} width={120 * k} height={H * 0.44} />
          <rect x={W * 0.7 - 120 * k} y={H * 0.42} width={120 * k} height={H * 0.44} />
          {/* balok penghubung + atap lengkung */}
          <rect x={W * 0.3} y={H * 0.4} width={W * 0.4} height={46 * k} />
          <path d={`M ${W * 0.32} ${H * 0.4} C ${W * 0.42} ${H * 0.3} ${W * 0.58} ${H * 0.3} ${W * 0.68} ${H * 0.4} Z`} />
          {/* pintu gerbang melengkung */}
          <path d={`M ${W * 0.46} ${H * 0.86} L ${W * 0.46} ${H * 0.56} C ${W * 0.46} ${H * 0.5} ${W * 0.54} ${H * 0.5} ${W * 0.54} ${H * 0.56} L ${W * 0.54} ${H * 0.86} Z`} fill="#04202c" />
        </g>
        {/* jendela menyala */}
        {windows.map((wd) => (
          <rect
            key={wd.i}
            x={W * 0.5 + wd.i * W * 0.05 - 12 * k}
            y={H * 0.44 + Math.abs(wd.i) * 14 * k}
            width={24 * k}
            height={40 * k}
            rx={6 * k}
            fill="rgba(126,240,170,0.85)"
            opacity={0.35 + 0.3 * Math.sin(t * 1.7 + wd.ph) + 0.12 * Math.sin(t * 5.3 + wd.ph)}
          />
        ))}
        {/* garis emas */}
        <rect x={W * 0.3} y={H * 0.4 - 6 * k} width={W * 0.4} height={6 * k} fill="rgba(232,197,116,0.4)" />
        {/* pantulan */}
        <g transform={`translate(0 ${H * 0.86 * 2}) scale(1 -1)`} opacity={0.12}>
          <rect x={W * 0.3} y={H * 0.42} width={120 * k} height={H * 0.44} fill="#03141d" />
          <rect x={W * 0.7 - 120 * k} y={H * 0.42} width={120 * k} height={H * 0.44} fill="#03141d" />
        </g>
        {/* ikan-ikan arwah */}
        {fish.map((fh, i) => {
          const span = W + 300 * k;
          let x = (fh.x0 * span + t * fh.v * fh.dir) % span;
          if (x < 0) x += span;
          const xx = fh.dir > 0 ? x - 150 * k : span - x - 150 * k;
          const y = fh.y * H + Math.sin(t * 0.8 + fh.ph) * 24 * k;
          const fs = fh.s * k;
          return (
            <g key={i} transform={`translate(${xx} ${y}) scale(${fh.dir * fs} ${fs})`} fill="#0a2b3b" opacity={0.6}>
              <ellipse cx="0" cy="0" rx="46" ry="16" />
              <path d="M 40 0 L 66 -14 L 66 14 Z" />
            </g>
          );
        })}
      </svg>
      <Particles count={20} color="190,240,220" seed={9} opacity={0.4} speed={0.9} minSize={2} maxSize={6} />
      <Particles count={14} color="232,197,116" seed={10} opacity={0.25} speed={0.4} minSize={1.5} maxSize={3.5} />
    </AbsoluteFill>
  );
};
