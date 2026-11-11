// Generator overlay prosedural (PNG) — 100% Node, tanpa dependensi.
// fog-a/fog-b: tekstur kabut (fBm value noise, mirror-tile saat dipakai).
// vignette-long/short: gelap di tepi. noise: grain film.

import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {fileURLToPath} from 'node:url';

const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'public', 'overlays');

// ---------- PNG encoder ----------
const CRC_TABLE = (() => {
  const t = new Int32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

const crc32 = (buf) => {
  let c = -1;
  for (let i = 0; i < buf.length; i++) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ -1) >>> 0;
};

const chunk = (type, data) => {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const t = Buffer.from(type, 'ascii');
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([t, data])));
  return Buffer.concat([len, t, data, crc]);
};

const writePNG = (file, w, h, rgba) => {
  const stride = w * 4;
  const raw = Buffer.alloc((stride + 1) * h);
  for (let y = 0; y < h; y++) {
    raw[y * (stride + 1)] = 0;
    rgba.copy(raw, y * (stride + 1) + 1, y * stride, (y + 1) * stride);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(w, 0);
  ihdr.writeUInt32BE(h, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const png = Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk('IHDR', ihdr),
    chunk('IDAT', zlib.deflateSync(raw, {level: 6})),
    chunk('IEND', Buffer.alloc(0)),
  ]);
  fs.mkdirSync(path.dirname(file), {recursive: true});
  fs.writeFileSync(file, png);
  console.log('write', file, `${w}x${h}`, `${(png.length / 1024).toFixed(0)} KB`);
};

// ---------- value noise + fBm ----------
const hash2 = (x, y, seed) => {
  let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) + Math.imul(seed, 2246822519);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

const smoothstep = (a, b, x) => {
  const u = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return u * u * (3 - 2 * u);
};

const valueNoise = (x, y, seed) => {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash2(xi, yi, seed);
  const b = hash2(xi + 1, yi, seed);
  const c = hash2(xi, yi + 1, seed);
  const d = hash2(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
};

const fbm = (x, y, seed, oct = 4) => {
  let v = 0;
  let amp = 0.5;
  let f = 1;
  for (let o = 0; o < oct; o++) {
    v += amp * valueNoise(x * f, y * f, seed + o * 101);
    f *= 2;
    amp *= 0.5;
  }
  return v;
};

// ---------- kabut ----------
const fog = (file, seed) => {
  const w = 2048;
  const h = 512;
  const buf = Buffer.alloc(w * h * 4);
  for (let y = 0; y < h; y++) {
    const edge = smoothstep(0, 70, y) * smoothstep(0, 70, h - 1 - y);
    for (let x = 0; x < w; x++) {
      const n = fbm(x * 0.0035, y * 0.011, seed, 4);
      const a = Math.round(smoothstep(0.46, 0.74, n) * edge * 165);
      const i = (y * w + x) * 4;
      buf[i] = 222;
      buf[i + 1] = 233;
      buf[i + 2] = 228;
      buf[i + 3] = a;
    }
  }
  writePNG(file, w, h, buf);
};

// ---------- vignette ----------
const vignette = (file, w, h) => {
  const buf = Buffer.alloc(w * h * 4);
  const cx = w / 2;
  const cy = h / 2;
  const R = Math.hypot(w, h) / 2;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const r = Math.hypot(x - cx, y - cy) / R;
      let a = Math.pow(Math.min(1, Math.max(0, (r - 0.52) / 0.48)), 1.5) * 235;
      const band = Math.max(smoothstep(h * 0.16, 0, y), smoothstep(h * 0.16, 0, h - 1 - y));
      a += band * 45;
      const i = (y * w + x) * 4;
      buf[i] = 3;
      buf[i + 1] = 7;
      buf[i + 2] = 12;
      buf[i + 3] = Math.min(255, Math.round(a));
    }
  }
  writePNG(file, w, h, buf);
};

// ---------- grain ----------
const noise = (file) => {
  const w = 512;
  const h = 512;
  const buf = Buffer.alloc(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    const v = (hash2(i % w, (i / w) | 0, 777) * 256) | 0;
    buf[i * 4] = v;
    buf[i * 4 + 1] = v;
    buf[i * 4 + 2] = v;
    buf[i * 4 + 3] = 255;
  }
  writePNG(file, w, h, buf);
};

fog(path.join(OUT, 'fog-a.png'), 7);
fog(path.join(OUT, 'fog-b.png'), 13);
vignette(path.join(OUT, 'vignette-long.png'), 1280, 720);
vignette(path.join(OUT, 'vignette-short.png'), 720, 1280);
noise(path.join(OUT, 'noise.png'));
console.log('overlay selesai.');
