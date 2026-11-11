// Sintesis ambience horor 100% dari ffmpeg (tanpa file audio eksternal):
// laut + angin + drone gelap + boom + guntur + riser, lalu tulis WAV stereo 48k.

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {FFMPEG} from './ffmpeg.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const type = process.argv[2] ?? 'long';
const evPath = path.join(ROOT, 'out', `events-${type}.json`);
if (!fs.existsSync(evPath)) {
  console.error(`File ${evPath} tidak ada — jalankan "npm run measure" dulu.`);
  process.exit(1);
}
const ev = JSON.parse(fs.readFileSync(evPath, 'utf8'));
const D = ev.duration.toFixed(3);

const args = ['-y', '-hide_banner', '-loglevel', 'error'];
const filters = [];
let idx = 0;

const addInput = (expr) => {
  args.push('-f', 'lavfi', '-t', D, '-i', expr);
  return idx++;
};

const stereo = (i) => `aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo`;

// Laut (L/R decorrelated)
const oL = addInput('anoisesrc=color=pink:sample_rate=48000:seed=11');
const oR = addInput('anoisesrc=color=pink:sample_rate=48000:seed=12');
filters.push(`[${oL}:a]lowpass=f=380,tremolo=f=0.1:d=0.45,volume=0.5[oLx]`);
filters.push(`[${oR}:a]lowpass=f=380,tremolo=f=0.11:d=0.5,volume=0.5[oRx]`);
filters.push(`[oLx][oRx]amerge=inputs=2,${stereo(0)}[ocean]`);

// Angin
const wL = addInput('anoisesrc=color=brown:sample_rate=48000:seed=21');
const wR = addInput('anoisesrc=color=brown:sample_rate=48000:seed=22');
filters.push(`[${wL}:a]highpass=f=180,lowpass=f=1500,tremolo=f=0.1:d=0.55,volume=0.13[wLx]`);
filters.push(`[${wR}:a]highpass=f=180,lowpass=f=1500,tremolo=f=0.1:d=0.6,volume=0.13[wRx]`);
filters.push(`[wLx][wRx]amerge=inputs=2,${stereo(0)}[wind]`);

// Drone gelap (D minor)
const droneFreqs = [
  [36.71, 0.2],
  [73.42, 0.14],
  [73.9, 0.1],
  [110.0, 0.085],
  [146.83, 0.05],
];
const droneIdx = droneFreqs.map(([f]) => addInput(`sine=frequency=${f}:sample_rate=48000`));
droneIdx.forEach((i, j) => filters.push(`[${i}:a]volume=${droneFreqs[j][1]}[d${j}]`));
filters.push(
  droneIdx.map((_, j) => `[d${j}]`).join('') +
    `amix=inputs=${droneIdx.length}:normalize=0,tremolo=f=0.1:d=0.3,lowpass=f=420,volume=0.8,${stereo(0)}[drone]`
);

// Boom (sub-drop) di tiap event
ev.booms.forEach((t, j) => {
  const i = addInput('sine=frequency=46:sample_rate=48000');
  const ms = Math.round(t * 1000);
  filters.push(`[${i}:a]afade=t=in:st=0:d=0.012,afade=t=out:st=0.3:d=2.0,volume=1.15,${stereo(0)},adelay=${ms}|${ms}[b${j}]`);
});

// Guntur
ev.thunders.forEach((t, j) => {
  const i = addInput(`anoisesrc=color=brown:sample_rate=48000:seed=${31 + j * 7}`);
  const ms = Math.round(t * 1000);
  filters.push(
    `[${i}:a]lowpass=f=110,afade=t=in:st=0:d=0.05,afade=t=out:st=0.7:d=5.6,volume=1.5,` +
      `aecho=0.8:0.5:300|700:0.3|0.16,${stereo(0)},adelay=${ms}|${ms}[t${j}]`
  );
});

// Riser (sebelum title / endcard)
ev.risers.forEach(([start, end], j) => {
  const dur = (end - start).toFixed(3);
  const ms = Math.round(start * 1000);
  const n = addInput('anoisesrc=color=white:sample_rate=48000:seed=41');
  const tone = addInput(`aevalsrc=0.22*sin(2*PI*(160*t+95*t*t)):s=48000:d=${dur}`);
  filters.push(`[${n}:a]highpass=f=800,afade=t=in:st=0:d=${dur},volume=0.4,${stereo(0)},adelay=${ms}|${ms}[rn${j}]`);
  filters.push(`[${tone}:a]afade=t=in:st=0:d=${dur},volume=0.6,${stereo(0)},adelay=${ms}|${ms}[rt${j}]`);
});

const mixLabels = ['[ocean]', '[wind]', '[drone]']
  .concat(ev.booms.map((_, j) => `[b${j}]`))
  .concat(ev.thunders.map((_, j) => `[t${j}]`))
  .concat(ev.risers.flatMap((_, j) => [`[rn${j}]`, `[rt${j}]`]));

// amix dibatasi 16 input -> campur bertingkat (penjumlahan murni, normalize=0)
const groups = [];
for (let i = 0; i < mixLabels.length; i += 8) groups.push(mixLabels.slice(i, i + 8));
groups.forEach((g, gi) => {
  if (g.length === 1) {
    filters.push(`${g[0]}anull[g${gi}]`);
  } else {
    filters.push(`${g.join('')}amix=inputs=${g.length}:normalize=0[g${gi}]`);
  }
});
filters.push(
  groups.map((_, gi) => `[g${gi}]`).join('') +
    `amix=inputs=${groups.length}:normalize=0:duration=longest,alimiter=limit=0.85,` +
    `afade=t=in:st=0:d=1.5,afade=t=out:st=${(D - 2.8).toFixed(3)}:d=2.8,${stereo(0)}[aout]`
);

const outFile = path.join(ROOT, 'audio', type, 'ambience.wav');
args.push('-filter_complex', filters.join(';'), '-map', '[aout]', '-c:a', 'pcm_s16le', '-ar', '48000', outFile);

console.log(`Menyintesis ambience ${type} (${D}s, ${ev.booms.length} boom, ${ev.thunders.length} guntur)...`);
const r = spawnSync(FFMPEG, args, {stdio: 'inherit'});
if (r.status !== 0) {
  console.error('Gagal sintesis ambience.');
  process.exit(1);
}
console.log('OK ->', outFile);
