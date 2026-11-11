// Campur VO + ambience: VO di posisi tepat, ambience di-duck mengikuti VO,
// loudness dinormalisasi ke standar YouTube (-14 LUFS).

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {FFMPEG} from './ffmpeg.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const type = process.argv[2] ?? 'long';

const timings = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', `timings-${type}.json`), 'utf8'));
const audioDir = path.join(ROOT, 'audio', type);
const ambience = path.join(audioDir, 'ambience.wav');
if (!fs.existsSync(ambience)) {
  console.error('ambience.wav tidak ada — jalankan npm run ambience:' + type);
  process.exit(1);
}

const args = ['-y', '-hide_banner', '-loglevel', 'error'];
const filters = [];
const voLabels = [];

timings.scenes.forEach((s, j) => {
  args.push('-i', path.join(audioDir, `${s.id.replace(/^s\d+$/, (m) => `vo-${m.slice(1).padStart(2, '0')}`).replace(/^h(\d+)$/, (m, d) => `vo-${String(d).padStart(2, '0')}`)}.wav`));
  const ms = Math.round(s.voStart * 1000);
  filters.push(`[${j}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,adelay=${ms}|${ms}[v${j}]`);
  voLabels.push(`[v${j}]`);
});

const ambIdx = timings.scenes.length;
args.push('-i', ambience);

filters.push(
  voLabels.join('') + `amix=inputs=${voLabels.length}:normalize=0,highpass=f=78,` +
    `acompressor=threshold=0.112:ratio=2.6:attack=9:release=160,volume=1.22[vo]`
);
filters.push(`[${ambIdx}:a]aformat=sample_fmts=fltp:sample_rates=48000:channel_layouts=stereo,volume=0.9[amb]`);
filters.push(`[amb][vo]sidechaincompress=threshold=0.02:ratio=7:attack=22:release=560[duck]`);
filters.push(
  `[vo][duck]amix=inputs=2:normalize=0,alimiter=limit=0.93,` +
    `loudnorm=I=-14:TP=-1.5:LRA=11,aresample=48000[aout]`
);

const outFile = path.join(ROOT, 'out', `${type}-audio.m4a`);
args.push('-filter_complex', filters.join(';'), '-map', '[aout]', '-c:a', 'aac', '-b:a', '192k', outFile);

console.log(`Mix audio ${type}...`);
const r = spawnSync(FFMPEG, args, {stdio: 'inherit'});
if (r.status !== 0) {
  console.error('Gagal mix audio.');
  process.exit(1);
}
console.log('OK ->', outFile);
