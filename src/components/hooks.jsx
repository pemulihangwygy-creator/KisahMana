import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';

export const useScene = () => {
  const f = useCurrentFrame();
  const {width, height, fps, durationInFrames} = useVideoConfig();
  return {
    f,
    t: f / fps,
    W: width,
    H: height,
    fps,
    total: durationInFrames,
    k: height / 1440,
    vertical: height > width,
  };
};
