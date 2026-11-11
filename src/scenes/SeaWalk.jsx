import React, {useMemo} from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {useScene} from '../components/hooks.jsx';
import {Stars, Moon, Ripples, Particles} from '../components/Atmosphere.jsx';
import {WomanWind, QueenFigure} from '../components/Silhouettes.jsx';
import {wavePath} from '../theme.js';

export const SeaWalk = ({progress = 0, flashTimes = [], variant = 'long'}) => {
  const {f, t, W, H, fps, k} = useScene();
  const horizon = H * 0.5;
  const bands = [
    {y: 0, amp: 9, speed: 16, color: '#0b1c29', h: 150},
    {y: 100, amp: 14, speed: 28, color: '#081521', h: 240},
    {y: 230, amp: 19, speed: 44, color: '#050e17', h: 380},
  ];
  const paths = useMemo(() => bands.map((b) => wavePath(W * 2, b.h * k, b.amp * k, b.y / 40)), [W, H, k]);
  const s = k * 1.15;
  const sink = progress * 120 * k;
  const revealP = Math.min(1, Math.max(0, (progress - 0.76) / 0.05));
  const glowP = Math.min(1, Math.max(0, (progress - 0.72) / 0.2));
  const flash = Math.exp(-((((progress - 0.79) * 90) / 4) ** 2));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #040910 0%, #071322 48%, #0a1a28 100%)'}}>
      <Stars count={100} opacity={0.8} maxY={horizon / H - 0.05} seed={8} />
      <Moon x={0.5} y={0.16} r={118 * k} glow={0.3} />
      <div
        style={{
          position: 'absolute',
          left: 0.5 * W - 150 * k,
          top: horizon,
          width: 300 * k,
          height: H - horizon,
          background: 'linear-gradient(180deg, rgba(214,238,228,0.2) 0%, rgba(214,238,228,0.02) 85%)',
          opacity: 0.65 + 0.25 * Math.sin(t * 0.65),
        }}
      />
      {/* sosok */}
      <svg viewBox={`0 0 ${W} ${H}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%'}}>
        <g opacity={1 - revealP} fill="#03060b">
          <g transform={`translate(${W * 0.5 - 100 * s} ${horizon + 130 * k + sink - 424 * s}) scale(${s})`}>
            <WomanWind hairSway={2 * Math.sin(t * 0.7)} />
          </g>
        </g>
        {revealP > 0 ? (
          <g opacity={revealP} fill="#041019">
            <g transform={`translate(${W * 0.5 - 95 * s * 1.2} ${horizon + 60 * k - 424 * s * 1.2 - revealP * 40 * k}) scale(${s * 1.2})`}>
              <QueenFigure hairSway={2.4 * Math.sin(t * 0.8)} gemColor="rgba(142,240,176,0.95)" />
            </g>
          </g>
        ) : null}
        {/* band air depan menutup kaki */}
        <g transform={`translate(0 ${horizon + 250 * k - progress * 70 * k})`}>
          <path d={paths[2]} fill="#061019" />
        </g>
      </svg>
      {/* riak & gelembung */}
      <Ripples x={0.5} y={0.62} period={2.6} maxW={520 * k} maxOp={0.4} />
      {glowP > 0 ? (
        <div
          style={{
            position: 'absolute',
            left: W * 0.5 - 450 * k,
            top: horizon + 40 * k - 450 * k,
            width: 900 * k,
            height: 900 * k,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(110,231,170,0.34) 0%, rgba(110,231,170,0.1) 40%, rgba(110,231,170,0) 68%)',
            opacity: glowP * (0.75 + 0.25 * Math.sin(t * 3)),
            transform: `scale(${0.3 + glowP * 1.3})`,
          }}
        />
      ) : null}
      {glowP > 0.3 ? <Particles count={16} color="170,240,200" seed={55} opacity={0.5} speed={1.4} minSize={2} maxSize={5} /> : null}
      {flash > 0.01 ? <AbsoluteFill style={{background: 'rgba(150,240,185,0.22)', opacity: flash, pointerEvents: 'none'}} /> : null}
    </AbsoluteFill>
  );
};
