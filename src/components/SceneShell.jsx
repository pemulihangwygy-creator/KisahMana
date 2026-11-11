import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {SCENES} from '../scenes/index.js';
import {Captions} from './Captions.jsx';
import {Fog, Grain, Vignette, Lightning} from './Atmosphere.jsx';
import {COLORS} from '../theme.js';

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

const FOG_BY_SCENE = {
  OceanStorm: 0.4,
  Keraton: 0.45,
  Ritual: 0.28,
  Forest: 0.8,
  Cliff: 0.5,
  SeaWalk: 0.55,
  Palace: 0.4,
  CalmSea: 0.32,
  Hotel: 0.22,
  Finale: 0.55,
  QueenReveal: 0.55,
};

const ChapterTag = ({index, label, frames}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const inOp = Math.min(1, frame / (0.5 * fps));
  const outOp = Math.min(1, (frames - frame) / (0.5 * fps));
  const op = Math.max(0, Math.min(inOp, outOp));
  return (
    <div
      style={{
        position: 'absolute',
        left: 72,
        top: 58,
        opacity: 0.72 * op,
        transform: `translateX(${(1 - inOp) * -26}px)`,
        fontFamily: '"Cinzel", serif',
        fontWeight: 700,
        fontSize: 30,
        letterSpacing: 9,
        color: '#d8e6de',
        textTransform: 'uppercase',
        pointerEvents: 'none',
      }}
    >
      Bagian {ROMAN[index - 1]} · {label}
      <div style={{width: 120, height: 2, background: 'rgba(142,240,176,0.5)', marginTop: 12}} />
    </div>
  );
};

export const SceneShell = ({scene, variant = 'long', frames, voDur, padIn, chapterIndex}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const Comp = SCENES[scene.scene];
  const flashTimes = scene.thunderAt != null ? [padIn + scene.thunderAt * voDur] : [];
  const fadeIn = Math.round(0.32 * fps);
  const fadeOut = Math.round(0.3 * fps);
  const opIn = Math.min(1, frame / fadeIn);
  const opOut = Math.min(1, (frames - frame) / fadeOut);
  const dark = Math.min(1, 1 - Math.min(opIn, opOut));
  return (
    <AbsoluteFill style={{backgroundColor: COLORS.ink}}>
      <Comp scene={scene} progress={frame / frames} flashTimes={flashTimes} durationSec={frames / fps} variant={variant} voDur={voDur} padIn={padIn} />
      <Fog intensity={FOG_BY_SCENE[scene.scene] ?? 0.45} />
      <Grain />
      <Vignette variant={variant} />
      <Lightning times={flashTimes} boltSeed={chapterIndex * 7 + 3} />
      {variant === 'long' && scene.chapter ? <ChapterTag index={chapterIndex} label={scene.chapter} frames={frames} /> : null}
      <Captions text={scene.text} start={padIn} duration={voDur} variant={variant} />
      {dark > 0.001 ? <AbsoluteFill style={{background: '#04080c', opacity: dark, pointerEvents: 'none'}} /> : null}
    </AbsoluteFill>
  );
};
