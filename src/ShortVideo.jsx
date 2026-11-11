import React from 'react';
import {AbsoluteFill, Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import timings from './timings-short.json';
import {shortScenes} from './story.js';
import {SHORT} from './config.js';
import {SceneShell} from './components/SceneShell.jsx';
import {Watermark} from './components/Watermark.jsx';
import {EndCard} from './components/cards.jsx';

const ProgressBar = () => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  return (
    <div style={{position: 'absolute', left: 0, top: 0, height: 6, width: `${(frame / durationInFrames) * 100}%`, background: 'rgba(142,240,176,0.8)'}} />
  );
};

export const ShortVideo = () => (
  <AbsoluteFill style={{backgroundColor: '#04080c'}}>
    {timings.scenes.map((s, i) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.frames}>
        <SceneShell scene={shortScenes[i]} variant="short" frames={s.frames} voDur={s.voDur} padIn={SHORT.padIn} chapterIndex={i + 1} />
      </Sequence>
    ))}
    <Sequence from={timings.endcard.from} durationInFrames={timings.endcard.frames}>
      <EndCard />
    </Sequence>
    <Watermark variant="short" />
    <ProgressBar />
  </AbsoluteFill>
);
