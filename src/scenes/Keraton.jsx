import React, {useMemo} from 'react';
import {AbsoluteFill} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Stars, Moon, Clouds, Particles} from '../components/Atmosphere.jsx';
import {WomanWind} from '../components/Silhouettes.jsx';
import {mulberry32} from '../theme.js';

const jogloPath = (cx, by, w, h) =>
  ` M ${cx - w / 2} ${by}` +
  ` C ${cx - w * 0.38} ${by - h * 0.62} ${cx - w * 0.16} ${by - h * 0.86} ${cx} ${by - h * 0.9}` +
  ` C ${cx + w * 0.16} ${by - h * 0.86} ${cx + w * 0.38} ${by - h * 0.62} ${cx + w / 2} ${by}` +
  ` L ${cx + w * 0.44} ${by + h * 0.06}` +
  ` C ${cx + w * 0.3} ${by - h * 0.5} ${cx + w * 0.12} ${by - h * 0.7} ${cx} ${by - h * 0.72}` +
  ` C ${cx - w * 0.12} ${by - h * 0.7} ${cx - w * 0.3} ${by - h * 0.5} ${cx - w * 0.44} ${by + h * 0.06} Z`;

export const Keraton = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {t, W, H, k} = useScene();
  const groundY = H * 0.8;
  const s = k * 0.75;
  const lanterns = useMemo(() => {
    const rnd = mulberry32(31);
    return [
      {x: 0.5, y: groundY - 300 * k},
      {x: 0.32, y: groundY - 205 * k},
      {x: 0.68, y: groundY - 205 * k},
      {x: 0.2, y: groundY - 90 * k},
      {x: 0.8, y: groundY - 90 * k},
    ].map((l) => ({...l, ph: rnd() * 6.28}));
  }, [groundY, k]);
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #060b14 0%, #0a1626 55%, #0d1b2b 72%, #081420 100%)'}}>
      <Stars count={90} opacity={0.75} maxY={0.4} seed={4} />
      <Moon x={0.78} y={0.16} r={72 * k} glow={0.18} />
      <Clouds count={3} seed={11} y={0.08} speed={0.5} />
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        {/* gunung latar */}
        <path
          d={`M0 ${H * 0.62} L${W * 0.18} ${H * 0.5} L${W * 0.34} ${H * 0.6} L${W * 0.52} ${H * 0.46} L${W * 0.72} ${H * 0.61} L${W * 0.88} ${H * 0.52} L${W} ${H * 0.63} L${W} ${H} L0 ${H} Z`}
          fill="#0a141f"
        />
        {/* joglo utama */}
        <path d={jogloPath(W * 0.5, groundY - 120 * k, 780 * k, 330 * k)} fill="#061019" />
        <path d={jogloPath(W * 0.26, groundY - 40 * k, 430 * k, 200 * k)} fill="#08131d" />
        <path d={jogloPath(W * 0.74, groundY - 40 * k, 430 * k, 200 * k)} fill="#08131d" />
        {/* pilar & dinding */}
        <rect x={W * 0.5 - 360 * k} y={groundY - 130 * k} width={720 * k} height={140 * k} fill="#050d15" />
        {[-3, -2, -1, 0, 1, 2, 3].map((i) => (
          <rect key={i} x={W * 0.5 + i * 110 * k - 9 * k} y={groundY - 130 * k} width={18 * k} height={140 * k} fill="#0a1a26" />
        ))}
        {/* jendela hangat */}
        {[-2, 0, 2].map((i) => (
          <rect key={i} x={W * 0.5 + i * 220 * k - 26 * k} y={groundY - 105 * k} width={52 * k} height={64 * k} fill="#e8a95c" opacity={0.5 + 0.2 * Math.sin(t * 2.2 + i)} />
        ))}
        {/* tanah */}
        <path d={`M0 ${groundY + 8 * k} L${W} ${groundY + 8 * k} L${W} ${H} L0 ${H} Z`} fill="#04090e" />
        {/* siluet putri */}
        <g transform={`translate(${W * 0.22 - 100 * s} ${groundY - 424 * s}) scale(${s})`} style={{pointerEvents: 'none'}}>
          <g fill="#03070c">
            <WomanWind hairSway={2.5 * Math.sin(t * 0.9)} />
          </g>
        </g>
      </svg>
      {/* lentera */}
      {lanterns.map((l, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: l.x * W - 90 * k,
            top: l.y * 1 - 90 * k,
            width: 180 * k,
            height: 180 * k,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(232,169,92,0.5) 0%, rgba(232,169,92,0.12) 45%, rgba(232,169,92,0) 70%)',
            opacity: 0.7 + 0.25 * Math.sin(t * 3.1 + l.ph) + 0.08 * Math.sin(t * 13 + l.ph * 2),
          }}
        />
      ))}
      <Particles count={22} color="232,197,116" seed={21} opacity={0.4} speed={0.35} minSize={2} maxSize={4} />
    </AbsoluteFill>
  );
};
