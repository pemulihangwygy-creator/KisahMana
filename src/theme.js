// Palet & util murni (tanpa React) supaya bisa dipakai juga oleh skrip Node.

export const COLORS = {
  ink: '#04080c',
  deep: '#071019',
  sea: '#0a1824',
  seaLight: '#12293a',
  mist: '#9fc3b8',
  accent: '#8ef0b0',
  gold: '#e8c574',
  text: '#f2f7f4',
  moon: '#e6efe8',
};

export const ACCENT_WORDS = [
  'hijau',
  'nyi roro kidul',
  'sang ratu',
  'ratu laut selatan',
  'dewi kadita',
  'kerajaan sunda',
  'kutukan',
  'kutukan hitam',
  'takdir',
  'badai',
  'tenggelam',
  'menoleh',
  'senja',
  'tiga-nol-delapan',
  'kamar',
];

// RNG deterministik (mulberry32)
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Gelombang periodik (path SVG) — period = width/2 agar mulus di-loop.
export function wavePath(width, height, amp, roughness = 1, phase = 0) {
  const period = width / 2;
  const steps = 12;
  let d = `M 0 ${height} L 0 ${height / 2}`;
  for (let i = 0; i <= steps * 2; i++) {
    const x = (period / steps) * i;
    const wob = Math.sin(i * 1.7 + phase) * amp * 0.35 * roughness;
    const y = height / 2 + Math.sin((i / steps) * Math.PI * 2 + phase) * amp + wob;
    const px = (period / steps) * (i - 1);
    const cx = (x + px) / 2;
    d += ` Q ${cx} ${y + amp * 0.3} ${x} ${y}`;
  }
  d += ` L ${width} ${height} Z`;
  return d;
}

// Pecah teks jadi potongan caption pendek.
export function splitChunks(text, maxWords = 4, maxChars = 26) {
  const words = text.split(/\s+/).filter(Boolean);
  const chunks = [];
  let cur = [];
  for (const w of words) {
    const candidate = [...cur, w].join(' ');
    if (cur.length && (candidate.length > maxChars || cur.length >= maxWords)) {
      chunks.push(cur.join(' '));
      cur = [w];
    } else {
      cur.push(w);
    }
  }
  if (cur.length) chunks.push(cur.join(' '));
  return chunks;
}

function weighChunk(chunk) {
  let w = chunk.length;
  if (/[,;:]["']?$/.test(chunk)) w += 7;
  if (/[.!?…]["']?$/.test(chunk)) w += 12;
  return w;
}

// Distribusikan potongan caption di rentang [start, start+duration] detik.
export function timedChunks(text, start, duration, maxWords = 4) {
  const chunks = splitChunks(text, maxWords);
  const weights = chunks.map(weighChunk);
  const total = weights.reduce((a, b) => a + b, 0);
  let t = start;
  return chunks.map((c, i) => {
    const d = (weights[i] / total) * duration;
    const item = {text: c, start: t, end: t + d};
    t += d;
    return item;
  });
}
