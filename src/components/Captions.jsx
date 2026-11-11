import React, {useMemo} from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {timedChunks, ACCENT_WORDS} from '../theme.js';

const ACCENT = new Set(ACCENT_WORDS);

export const Captions = ({text, start, duration, variant = 'long'}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const chunks = useMemo(() => timedChunks(text, start, duration, variant === 'short' ? 3 : 4), [text, start, duration, variant]);
  const t = frame / fps;
  const active = chunks.find((c) => t >= c.start && t < c.end) ?? null;
  if (!active) return null;
  const fin = Math.min(1, ((t - active.start) * fps) / 6);
  const fout = Math.min(1, ((active.end - t) * fps) / 5);
  const op = Math.max(0, Math.min(fin, fout));
  const words = active.text.split(' ');
  const isShort = variant === 'short';
  return (
    <div
      style={{
        position: 'absolute',
        left: width * 0.06,
        right: width * 0.06,
        top: isShort ? height * 0.34 : height * 0.78,
        textAlign: 'center',
        fontFamily: '"Bebas Neue", sans-serif',
        fontSize: isShort ? 104 : 86,
        lineHeight: 1.02,
        color: '#f4f8f5',
        letterSpacing: 2,
        opacity: op,
        transform: `translateY(${(1 - op) * 10}px)`,
        textShadow: '0 4px 22px rgba(0,0,0,0.9), 0 2px 4px rgba(0,0,0,0.95)',
        pointerEvents: 'none',
      }}
    >
      {words.map((w, i) => {
        const bare = w
          .toLowerCase()
          .replace(/[^a-z0-9\-]/g, '');
        const acc = ACCENT.has(bare);
        return (
          <span key={i} style={{color: acc ? '#8ef0b0' : undefined, margin: '0 0.14em'}}>
            {w}
          </span>
        );
      })}
    </div>
  );
};
