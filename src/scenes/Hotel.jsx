import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Particles} from '../components/Atmosphere.jsx';
import {mulberry32} from '../theme.js';

// Koridor hotel tua, perspektif satu titik — semua poligon dari kode.
export const Hotel = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {t, W, H, k} = useScene();
  const vpx = W * 0.5;
  const vpy = H * 0.47;
  const nearL = vpx - W * 0.13;
  const nearR = vpx + W * 0.13;
  const nearTop = vpy - H * 0.13;
  const nearBot = vpy + H * 0.115;
  const lerp = (a, b, u) => a + (b - a) * u;
  const doors = useMemo(() => {
    const rnd = mulberry32(88);
    return [0.3, 0.56, 0.79].map((d) => ({d, ph: rnd() * 6.28}));
  }, []);
  const underFlick = 0.5 + 0.3 * Math.sin(t * 1.3) + 0.16 * Math.sin(t * 6.7);
  return (
    <AbsoluteFill style={{background: '#050404'}}>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          transform: `scale(${1 + progress * 0.07}) translateY(${progress * 10 * k}px)`,
          transformOrigin: '50% 46%',
        }}
      >
        <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
          <defs>
            <radialGradient id="lampGlow">
              <stop offset="0%" stopColor="rgba(232,180,110,0.5)" />
              <stop offset="100%" stopColor="rgba(232,180,110,0)" />
            </radialGradient>
            <linearGradient id="underDoor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(240,190,110,0.85)" />
              <stop offset="100%" stopColor="rgba(240,190,110,0)" />
            </linearGradient>
          </defs>
          {/* langit-langit, lantai, dinding */}
          <polygon points={`0,0 ${W},0 ${nearR},${nearTop} ${nearL},${nearTop}`} fill="#0a0808" />
          <polygon points={`0,${H} ${W},${H} ${nearR},${nearBot} ${nearL},${nearBot}`} fill="#150d0b" />
          <polygon points={`0,0 0,${H} ${nearL},${nearBot} ${nearL},${nearTop}`} fill="#120d0b" />
          <polygon points={`${W},0 ${W},${H} ${nearR},${nearBot} ${nearR},${nearTop}`} fill="#0f0b0a" />
          {/* garis perspektif lantai */}
          {[0.12, 0.3, 0.5, 0.7, 0.88].map((u, i) => (
            <line key={i} x1={W * u} y1={H} x2={lerp(W * u, vpx, 0.86)} y2={lerp(H, vpy, 0.86)} stroke="rgba(0,0,0,0.5)" strokeWidth={3 * k} />
          ))}
          {/* dinding ujung */}
          <rect x={nearL} y={nearTop} width={nearR - nearL} height={nearBot - nearTop} fill="#0d0a09" />
          {/* pintu di kedua sisi */}
          {doors.map((dr, i) => {
            const u = dr.d;
            const xl = lerp(0, nearL, u);
            const xr = lerp(W, nearR, u);
            const yt = lerp(0, nearTop, u);
            const yb = lerp(H, nearBot, u);
            const dh = (yb - yt) * 0.62;
            const dw = (yb - yt) * 0.24;
            return (
              <g key={i}>
                <rect x={xl + dw * 0.25} y={yt + (yb - yt) * 0.18} width={dw} height={dh} fill="#0b0807" stroke="#1d1512" strokeWidth={2.5 * k} />
                <rect x={xr - dw * 1.25} y={yt + (yb - yt) * 0.18} width={dw} height={dh} fill="#0b0807" stroke="#1d1512" strokeWidth={2.5 * k} />
                {/* lampu dinding */}
                <circle cx={xl + dw * 0.75} cy={yt + (yb - yt) * 0.1} r={90 * k * (1 - u * 0.4)} fill="url(#lampGlow)" opacity={0.55 + 0.2 * Math.sin(t * 2.4 + dr.ph)} />
                <circle cx={xr - dw * 0.75} cy={yt + (yb - yt) * 0.1} r={90 * k * (1 - u * 0.4)} fill="url(#lampGlow)" opacity={0.55 + 0.2 * Math.sin(t * 2.4 + dr.ph + 1)} />
              </g>
            );
          })}
          {/* pintu 308 */}
          <rect x={vpx - W * 0.035} y={vpy - H * 0.02} width={W * 0.07} height={H * 0.11} fill="#151009" stroke="#241a12" strokeWidth={3 * k} />
          <rect x={vpx - 26 * k} y={vpy - H * 0.035} width={52 * k} height={30 * k} rx={4 * k} fill="#1a1410" />
          <text
            x={vpx}
            y={vpy - H * 0.035 + 15 * k}
            textAnchor="middle"
            fontFamily='"Bebas Neue", sans-serif'
            fontSize={26 * k}
            fill="#caa96a"
            letterSpacing={2 * k}
          >
            308
          </text>
          {/* cahaya merembes di bawah pintu */}
          <rect x={vpx - W * 0.034} y={vpy + H * 0.088} width={W * 0.068} height={8 * k} fill="url(#underDoor)" opacity={Math.max(0.25, underFlick)} />
        </svg>
      </div>
      <Particles count={14} color="210,190,160" seed={15} opacity={0.22} speed={0.25} minSize={1.5} maxSize={3} direction="down" />
    </AbsoluteFill>
  );
};
