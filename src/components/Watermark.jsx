import React from 'react';

export const Watermark = ({variant = 'long'}) => (
  <div
    style={{
      position: 'absolute',
      ...(variant === 'short' ? {top: 96, right: 40} : {bottom: 48, right: 56}),
      fontFamily: '"Cinzel", serif',
      fontWeight: 700,
      fontSize: variant === 'short' ? 32 : 30,
      letterSpacing: 7,
      color: 'rgba(226,240,232,0.5)',
      textShadow: '0 2px 10px rgba(0,0,0,0.7)',
      pointerEvents: 'none',
      zIndex: 50,
    }}
  >
    KISAHMANA
  </div>
);
