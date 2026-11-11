import React from 'react';
import {AbsoluteFill, Sequence} from 'remotion';
import timings from './timings-long.json';
import {longScenes} from './story.js';
import {LONG} from './config.js';
import {SceneShell} from './components/SceneShell.jsx';
import {Watermark} from './components/Watermark.jsx';
import {PreHook, TitleCard, Outro} from './components/cards.jsx';

export const LongVideo = () => (
  <AbsoluteFill style={{backgroundColor: '#04080c'}}>
    <Sequence from={0} durationInFrames={timings.prehook.frames}>
      <PreHook />
    </Sequence>
    <Sequence from={timings.title.from} durationInFrames={timings.title.frames}>
      <TitleCard />
    </Sequence>
    {timings.scenes.map((s, i) => (
      <Sequence key={s.id} from={s.from} durationInFrames={s.frames}>
        <SceneShell
          scene={longScenes[i]}
          variant="long"
          frames={s.frames}
          voDur={s.voDur}
          padIn={LONG.padIn}
          chapterIndex={i + 1}
        />
      </Sequence>
    ))}
    <Sequence from={timings.outro.from} durationInFrames={timings.outro.frames}>
      <Outro />
    </Sequence>
    <Watermark variant="long" />
  </AbsoluteFill>
);
