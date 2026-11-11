import React from 'react';
import {AbsoluteFill, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {Fog, Grain, Vignette, Lightning, Particles} from './Atmosphere.jsx';
import {OceanStorm} from '../scenes/OceanStorm.jsx';
import {QueenReveal} from '../scenes/QueenReveal.jsx';
import {Palace} from '../scenes/Palace.jsx';
import {EPISODE} from '../story.js';
import {LONG, SHORT, FPS} from '../config.js';

const clamp01 = (x) => Math.min(1, Math.max(0, x));

export const PreHook = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const N = Math.round(LONG.prehook * FPS);
  const sp = spring({frame: frame - 50, fps, config: {damping: 12, stiffness: 120, mass: 0.7}});
  const sceneOp = clamp01((frame - 14) / 20) * clamp01((N - frame) / 30);
  const textOp = clamp01((frame - 50) / 14) * clamp01((N - 30 - frame) / 26);
  const dark = 1 - clamp01((frame - 14) / 22);
  return (
    <AbsoluteFill style={{background: '#04080c'}}>
      <div style={{opacity: sceneOp}}>
        <QueenReveal progress={frame / N} flashTimes={[40 / fps]} durationSec={N / fps} variant="long" />
      </div>
      <Fog intensity={0.55} />
      <Grain />
      <Vignette variant="long" />
      <Lightning times={[40 / fps]} boltSeed={99} />
      <AbsoluteFill
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          opacity: textOp,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 172,
            letterSpacing: 8,
            color: '#f4f8f5',
            textShadow: '0 6px 34px rgba(0,0,0,0.9)',
            transform: `scale(${1.55 - 0.55 * Math.min(1, sp)})`,
          }}
        >
          JANGAN PAKAI HIJAU
        </div>
        <div
          style={{
            fontFamily: '"Bebas Neue", sans-serif',
            fontSize: 116,
            letterSpacing: 14,
            color: '#8ef0b0',
            textShadow: '0 4px 26px rgba(0,0,0,0.9)',
            transform: `scale(${1.4 - 0.4 * Math.min(1, sp)})`,
          }}
        >
          DI LAUT SELATAN
        </div>
      </AbsoluteFill>
      {dark > 0.001 ? <AbsoluteFill style={{background: '#04080c', opacity: dark}} /> : null}
    </AbsoluteFill>
  );
};

export const TitleCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const N = Math.round(LONG.title * FPS);
  const ap = (a, b) => clamp01((frame - a) / b);
  const out = clamp01((N - frame) / (0.7 * fps));
  return (
    <AbsoluteFill style={{background: '#04080c'}}>
      <OceanStorm calm progress={frame / N} flashTimes={[2.6]} durationSec={N / fps} variant="long" />
      <AbsoluteFill style={{background: 'rgba(3,7,10,0.5)'}} />
      <Fog intensity={0.55} />
      <Grain />
      <Vignette variant="long" />
      <Lightning times={[2.6]} boltSeed={7} />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out, pointerEvents: 'none'}}>
        <div style={{fontFamily: '"Cinzel", serif', fontWeight: 400, fontSize: 36, letterSpacing: 16, color: '#cfe0d6', opacity: ap(30, 40)}}>{EPISODE.kicker}</div>
        <div
          style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 900,
            fontSize: 184,
            letterSpacing: 10,
            color: '#f2e8c9',
            marginTop: 26,
            opacity: ap(70, 40),
            textShadow: '0 8px 60px rgba(0,0,0,0.85)',
          }}
        >
          {EPISODE.title}
        </div>
        <div style={{width: 560 * ap(110, 50), height: 2, background: 'rgba(232,197,116,0.75)', margin: '30px 0 26px'}} />
        <div style={{fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: 44, letterSpacing: 3, color: '#cfe3d8', opacity: ap(140, 45)}}>{EPISODE.subtitle}</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const Outro = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const N = Math.round(LONG.outro * FPS);
  const ap = (a, b) => clamp01((frame - a) / b);
  const out = clamp01((N - frame) / (0.9 * fps));
  const pulse = 1 + 0.018 * Math.sin((frame / fps) * 2.2);
  return (
    <AbsoluteFill style={{background: 'radial-gradient(ellipse at 50% 42%, #0a1a24 0%, #050b10 58%, #03070b 100%)'}}>
      <Fog intensity={0.5} top={0.35} />
      <Particles count={30} color="232,197,116" seed={44} opacity={0.5} speed={0.5} minSize={2} maxSize={5} />
      <Grain />
      <Vignette variant="long" />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out * ap(20, 40), pointerEvents: 'none'}}>
        <div style={{fontFamily: '"Cinzel", serif', fontWeight: 400, fontSize: 38, letterSpacing: 12, color: '#cfe0d6'}}>TERIMA KASIH SUDAH MENONTON</div>
        <div
          style={{
            fontFamily: '"Cinzel", serif',
            fontWeight: 900,
            fontSize: 148,
            letterSpacing: 14,
            color: '#f2e8c9',
            margin: '28px 0 20px',
            transform: `scale(${pulse})`,
            textShadow: '0 8px 50px rgba(0,0,0,0.9)',
          }}
        >
          KISAHMANA
        </div>
        <div style={{width: 480 * ap(90, 50), height: 2, background: 'rgba(232,197,116,0.7)'}} />
        <div style={{fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: 36, color: '#cfe3d8', marginTop: 26, opacity: ap(120, 45)}}>
          Kisah mistis Nusantara — cerita baru setiap pekan
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

export const EndCard = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const N = Math.round(SHORT.endcard * FPS);
  const ap = (a, b) => clamp01((frame - a) / b);
  const out = clamp01((N - frame) / (0.7 * fps));
  const pulse = 1 + 0.02 * Math.sin((frame / fps) * 2.4);
  return (
    <AbsoluteFill style={{background: '#04080c'}}>
      <Palace progress={frame / N} flashTimes={[]} durationSec={N / fps} variant="short" />
      <AbsoluteFill style={{background: 'rgba(3,8,12,0.45)'}} />
      <Fog intensity={0.4} />
      <Grain />
      <Vignette variant="short" />
      <AbsoluteFill style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: out * ap(15, 35), pointerEvents: 'none'}}>
        <div style={{fontFamily: '"Cinzel", serif', fontWeight: 900, fontSize: 104, letterSpacing: 8, color: '#f2e8c9', transform: `scale(${pulse})`, textShadow: '0 8px 50px rgba(0,0,0,0.9)'}}>IKUTI KISAHMANA</div>
        <div style={{width: 420 * ap(60, 40), height: 2, background: 'rgba(142,240,176,0.7)', margin: '30px 0'}} />
        <div style={{fontFamily: '"Poppins", sans-serif', fontWeight: 300, fontSize: 42, color: '#cfe3d8', opacity: ap(90, 40)}}>Untuk kisah mistis Nusantara lainnya</div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
