import React from 'react';
import {Composition} from 'remotion';
import timingsLong from './timings-long.json';
import timingsShort from './timings-short.json';
import {LongVideo} from './LongVideo.jsx';
import {ShortVideo} from './ShortVideo.jsx';
import {LONG, SHORT, FPS} from './config.js';

export const RemotionRoot = () => (
  <>
    <Composition
      id={LONG.id}
      component={LongVideo}
      durationInFrames={timingsLong.totalFrames}
      fps={FPS}
      width={LONG.width}
      height={LONG.height}
    />
    <Composition
      id={SHORT.id}
      component={ShortVideo}
      durationInFrames={timingsShort.totalFrames}
      fps={FPS}
      width={SHORT.width}
      height={SHORT.height}
    />
  </>
);
