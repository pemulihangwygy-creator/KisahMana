import React, {useMemo} from 'react';
import {AbsoluteFill, Img, useCurrentFrame, useVideoConfig, staticFile} from 'remotion';
import {mulberry32} from '../theme.js';

// ---------- Kabut (tekstur PNG mirror-tile, digeser via transform) ----------
export const Fog = ({intensity = 0.5, speed = 1, top = 0.3, height = 0.5}) => {
  const frame = useCurrentFrame();
  const {width, height: H} = useVideoConfig();
  const layers = [
    {src: 'fog-a.png', op: 0.5, dx: 0.16, y: top, h: height},
    {src: 'fog-b.png', op: 0.34, dx: -0.1, y: top + 0.14, h: height * 0.8},
  ];
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {layers.map((l, i) => {
        const w = width * 2;
        const drift = ((frame * l.dx * speed) % w + w) % w;
        const hh = H * l.h + 140;
        return (
          <div key={i} style={{position: 'absolute', top: l.y * H, left: 0, height: hh, width, opacity: l.op * intensity, overflow: 'hidden'}}>
            <Img src={staticFile(`overlays/${l.src}`)} style={{position: 'absolute', top: 0, left: -drift, width: w, height: hh}} />
            <Img src={staticFile(`overlays/${l.src}`)} style={{position: 'absolute', top: 0, left: -drift + w, width: w, height: hh, transform: 'scaleX(-1)'}} />
          </div>
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Grain film ----------
export const Grain = ({opacity = 0.045}) => {
  const frame = useCurrentFrame();
  const hx = (frame * 53) % 512;
  const hy = (frame * 97) % 512;
  return (
    <div
      style={{
        position: 'absolute',
        left: -512,
        top: -512,
        right: -512,
        bottom: -512,
        backgroundImage: `url(${staticFile('overlays/noise.png')})`,
        backgroundRepeat: 'repeat',
        opacity,
        transform: `translate(${hx - 256}px, ${hy - 256}px)`,
        pointerEvents: 'none',
      }}
    />
  );
};

export const Vignette = ({variant = 'long'}) => (
  <Img
    src={staticFile(variant === 'short' ? 'overlays/vignette-short.png' : 'overlays/vignette-long.png')}
    style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}
  />
);

// ---------- Partikel (debu / bara / gelembung) ----------
export const Particles = ({count = 24, color = '190,235,215', seed = 1, opacity = 0.5, speed = 1, minSize = 2, maxSize = 6, direction = 'up'}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const items = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({length: count}, () => ({
      x0: rnd(),
      y0: rnd(),
      s: minSize + rnd() * (maxSize - minSize),
      v: (18 + rnd() * 52) * speed,
      ph: rnd() * Math.PI * 2,
      amp: 10 + rnd() * 30,
      op: 0.25 + rnd() * 0.55,
    }));
  }, [count, seed, speed, minSize, maxSize]);
  const t = frame / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {items.map((p, i) => {
        const span = height + 120;
        let yy = (p.y0 * span + (direction === 'up' ? -1 : 1) * p.v * t) % span;
        if (yy < 0) yy += span;
        const y = yy - 60;
        const x = p.x0 * width + Math.sin(t * 0.5 + p.ph) * p.amp;
        const o = p.op * opacity * (0.55 + 0.45 * Math.sin(t * 0.9 + p.ph * 3));
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: p.s,
              height: p.s,
              borderRadius: '50%',
              background: `rgba(${color},1)`,
              opacity: Math.max(0, o),
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Hujan ----------
export const Rain = ({count = 70, opacity = 0.3, speed = 1, seed = 5, slant = -0.35}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const drops = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({length: count}, () => ({x0: rnd(), y0: rnd(), len: 16 + rnd() * 30, v: (950 + rnd() * 700) * speed, o: 0.4 + rnd() * 0.6}));
  }, [count, seed, speed]);
  const t = frame / fps;
  const span = height + 120;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {drops.map((d, i) => {
        let yy = (d.y0 * span + d.v * t) % span;
        if (yy < 0) yy += span;
        const spanX = width + 100;
        const x = (((d.x0 * spanX + t * 120 * slant) % spanX) + spanX) % spanX - 50;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: yy - 60,
              width: 2,
              height: d.len,
              opacity: d.o * opacity,
              background: 'linear-gradient(180deg, rgba(185,214,224,0) 0%, rgba(185,214,224,0.9) 100%)',
              transform: `rotate(${slant * 14}deg)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Bintang ----------
export const Stars = ({count = 80, seed = 2, opacity = 0.7, maxY = 0.55}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const stars = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({length: count}, () => ({x: rnd(), y: rnd() * maxY, s: 1 + rnd() * 1.8, ph: rnd() * 6.28, f: 0.3 + rnd() * 0.7, o: 0.4 + rnd() * 0.6}));
  }, [count, seed, maxY]);
  const t = frame / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {stars.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x * width,
            top: s.y * height,
            width: s.s,
            height: s.s,
            borderRadius: '50%',
            background: '#dceaf0',
            opacity: Math.max(0, s.o * opacity * (0.35 + 0.65 * Math.abs(Math.sin(t * s.f + s.ph)))),
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// ---------- Bulan ----------
export const Moon = ({x = 0.72, y = 0.2, r = 90, color = '#e6efe8', glow = 0.16}) => {
  const {width, height} = useVideoConfig();
  const cx = x * width;
  const cy = y * height;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      <div
        style={{
          position: 'absolute',
          left: cx - r * 2.6,
          top: cy - r * 2.6,
          width: r * 5.2,
          height: r * 5.2,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(210,235,222,${glow}) 0%, rgba(210,235,222,0) 62%)`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: cx - r,
          top: cy - r,
          width: r * 2,
          height: r * 2,
          borderRadius: '50%',
          background: `radial-gradient(circle at 42% 40%, #f4faf5 0%, ${color} 55%, rgba(198,220,206,0.85) 72%, rgba(198,220,206,0) 78%)`,
        }}
      />
    </AbsoluteFill>
  );
};

// ---------- Awan ----------
export const Clouds = ({count = 4, seed = 9, y = 0.16, tint = '10,18,26', opacity = 0.8, speed = 1}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const clouds = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({length: count}, () => ({x0: rnd(), y: y + rnd() * 0.16, w: 0.25 + rnd() * 0.3, h: 0.05 + rnd() * 0.05, v: (6 + rnd() * 14) * speed, o: 0.5 + rnd() * 0.5}));
  }, [count, seed, y, speed]);
  const t = frame / fps;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {clouds.map((c, i) => {
        const span = 1.4;
        let xx = (c.x0 + (c.v * t) / width) % span;
        if (xx < 0) xx += span;
        const x = (xx - 0.2) * width;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: c.y * height,
              width: c.w * width,
              height: c.h * height,
              borderRadius: '50%',
              background: `radial-gradient(ellipse at 50% 50%, rgba(${tint},${0.85 * c.o * opacity}) 0%, rgba(${tint},0) 70%)`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Kilat ----------
const boltPath = (seed, W, H) => {
  const rnd = mulberry32(seed);
  let x = W * (0.28 + rnd() * 0.44);
  let y = 0;
  const pts = [[x, y]];
  while (y < H * 0.55) {
    y += H * (0.06 + rnd() * 0.08);
    x += (rnd() - 0.5) * W * 0.08;
    pts.push([x, y]);
  }
  return 'M' + pts.map((p) => `${p[0].toFixed(0)} ${p[1].toFixed(0)}`).join(' L ');
};

export const Lightning = ({times = [], strength = 1, boltSeed = 1, bolt = true}) => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const path = useMemo(() => boltPath(boltSeed, width, height), [boltSeed, width, height]);
  let env = 0;
  let nearest = -1;
  let best = 1e9;
  let since = 1e9;
  times.forEach((sec, i) => {
    const ff = sec * fps;
    const e = Math.exp(-(((frame - ff) / 6) ** 2)) + 0.55 * Math.exp(-(((frame - ff - 7) / 10) ** 2));
    if (e > env) env = e;
    const d = frame - ff;
    if (Math.abs(d) < best) {
      best = Math.abs(d);
      nearest = i;
    }
    if (d >= 0 && d < since) since = d;
  });
  const showBolt = bolt && nearest >= 0 && since >= 0 && since < 12;
  if (env < 0.004 && !showBolt) return null;
  return (
    <>
      <AbsoluteFill style={{background: 'radial-gradient(circle at 50% 30%, #e2fceb 0%, #c8f4de 100%)', opacity: Math.min(0.55, env * 0.36 * strength), pointerEvents: 'none'}} />
      {showBolt ? (
        <svg viewBox={`0 0 ${width} ${height}`} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none'}}>
          <path d={path} fill="none" stroke="rgba(160,255,205,0.28)" strokeWidth={22} strokeLinecap="round" />
          <path d={path} fill="none" stroke="#eafff2" strokeWidth={5} strokeLinecap="round" />
        </svg>
      ) : null}
    </>
  );
};

// ---------- Riak air ----------
export const Ripples = ({x = 0.5, y = 0.72, count = 3, period = 2.4, maxW = 420, color = '180,230,205', maxOp = 0.5}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{pointerEvents: 'none'}}>
      {Array.from({length: count}, (_, i) => {
        const ph = (t / period + i / count) % 1;
        const w = maxW * (0.18 + ph * 0.95);
        const o = (1 - ph) * (1 - ph) * maxOp;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: x * width - w / 2,
              top: y * height - w * 0.12,
              width: w,
              height: w * 0.24,
              borderRadius: '50%',
              border: `2px solid rgba(${color},${o})`,
            }}
          />
        );
      })}
    </AbsoluteFill>
  );
};

// ---------- Berkas cahaya (bawah laut) ----------
export const LightShafts = ({count = 4, seed = 3, opacity = 1}) => {
  const frame = useCurrentFrame();
  const {width, height, fps} = useVideoConfig();
  const shafts = useMemo(() => {
    const rnd = mulberry32(seed);
    return Array.from({length: count}, () => ({x: 0.08 + rnd() * 0.84, w: 0.07 + rnd() * 0.1, rot: -20 + rnd() * 30, ph: rnd() * 6.28, o: 0.5 + rnd() * 0.5}));
  }, [count, seed]);
  const t = frame / fps;
  return (
    <AbsoluteFill style={{overflow: 'hidden', pointerEvents: 'none'}}>
      {shafts.map((s, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: s.x * width,
            top: -height * 0.15,
            width: s.w * width,
            height: height * 1.35,
            background: 'linear-gradient(180deg, rgba(150,225,190,0.13) 0%, rgba(150,225,190,0.05) 55%, rgba(150,225,190,0) 85%)',
            transform: `rotate(${s.rot}deg) translateX(${Math.sin(t * 0.14 + s.ph) * 36}px)`,
            transformOrigin: '50% 0%',
            opacity: s.o * opacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};
