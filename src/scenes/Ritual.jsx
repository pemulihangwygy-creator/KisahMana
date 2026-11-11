import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Particles} from '../components/Atmosphere.jsx';
import {mulberry32} from '../theme.js';

export const Ritual = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {t, W, H, k} = useScene();
  const candles = useMemo(() => {
    const rnd = mulberry32(77);
    return Array.from({length: 7 }, (_, i) => ({
      x: W * (0.5 + (i - 3) * 0.082) + (rnd() - 0.5) * 20 * k,
      y: H * 0.88 - Math.abs(i - 3) * H * 0.014,
      ph: rnd() * 6.28,
      h: 60 + rnd() * 40,
    }));
  }, [W, H, k]);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 88%, #1c0d0a 0%, #0a0507 45%, #040305 100%)'}}>
      {/* asap dupa */}
      {[0, 1, 2].map((i) => {
        const cycle = (H * 0.42);
        const dist = (t * 46 * (0.7 + 0.22 * i)) % cycle;
        const yy = H * 0.78 - dist;
        const o = Math.sin((Math.PI * dist) / cycle) * 0.15;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: W * (0.4 + 0.1 * i) - 70 * k,
              top: yy,
              width: 140 * k,
              height: 300 * k,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse at 50% 60%, rgba(200,190,190,0.5) 0%, rgba(200,190,190,0) 70%)',
              opacity: o,
              transform: `translateX(${Math.sin(t * 0.8 + i * 2) * 30 * k}px)`,
            }}
          />
        );
      })}
      {/* sosok bayangan (ibu tiri) */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <g transform={`translate(${W * 0.5 - 105 * k * 1.5} ${H * 0.3}) scale(${k * 1.5})`}>
          <path
            d="M60 0 C30 10 18 44 22 84 C26 124 14 170 6 214 C0 246 4 278 18 300 C40 312 80 318 120 312 C150 306 172 292 180 272 C170 236 166 196 170 158 C174 116 168 70 150 40 C136 16 96 -8 60 0 Z"
            fill="#050307"
          />
          <path d="M96 6 C86 -12 108 -18 118 -2 Z" fill="#050307" />
          {/* keris di atas tikar */}
          <path d="M40 318 L150 310 L158 316 L44 326 Z" fill="#0d0a0c" />
        </g>
        {/* tikar */}
        <ellipse cx={W * 0.5} cy={H * 0.93} rx={W * 0.3} ry={H * 0.035} fill="#0b0709" />
      </svg>
      {/* lilin */}
      {candles.map((c, i) => (
        <div key={i} style={{position: 'absolute', left: c.x, top: c.y}}>
          <div
            style={{
              position: 'absolute',
              left: -110 * k,
              top: -110 * k,
              width: 220 * k,
              height: 220 * k,
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(255,190,100,0.42) 0%, rgba(255,150,60,0.1) 45%, rgba(255,150,60,0) 70%)',
              opacity: 0.75 + 0.2 * Math.sin(t * 7 + c.ph) + 0.1 * Math.sin(t * 23 + c.ph * 2),
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: -5 * k,
              top: -30 * k,
              width: 10 * k,
              height: 30 * k,
              borderRadius: '50% 50% 50% 50% / 62% 62% 38% 38%',
              background: 'linear-gradient(180deg, #ffd98a 0%, #e8742a 90%)',
              transformOrigin: '50% 100%',
              transform: `scaleY(${0.85 + 0.18 * Math.sin(t * 9.5 + c.ph) + 0.07 * Math.sin(t * 27 + c.ph * 2)})`,
            }}
          />
          <div style={{position: 'absolute', left: -7 * k, top: 0, width: 14 * k, height: c.h * k, background: '#120c0d'}} />
        </div>
      ))}
      <Particles count={18} color="200,180,170" seed={13} opacity={0.3} speed={0.3} minSize={1.5} maxSize={3.5} direction="down" />
      <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 60%, rgba(170,40,30,0.06) 0%, rgba(170,40,30,0) 60%)', opacity: 0.6 + 0.4 * Math.sin(t * 0.5), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};
