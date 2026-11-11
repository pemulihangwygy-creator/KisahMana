// Render per-bagian (resumable): pecah komposisi jadi chunk frame, render
// berurutan, skip part yang sudah ada. Hasil digabung scripts/finalize.mjs.

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const type = process.argv[2] ?? 'long';
const CHUNK = 3000;

const timings = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', `timings-${type}.json`), 'utf8'));
const comp = type === 'long' ? 'KisahManaLong' : 'KisahManaShort';
const remotion = path.join(ROOT, 'node_modules', '.bin', 'remotion');
const partsDir = path.join(ROOT, 'out', `${type}-parts`);
fs.mkdirSync(partsDir, {recursive: true});

const total = timings.totalFrames;
for (let start = 0; start < total; start += CHUNK) {
  const end = Math.min(total - 1, start + CHUNK - 1);
  const idx = String(Math.floor(start / CHUNK)).padStart(2, '0');
  const out = path.join(partsDir, `part-${idx}.mp4`);
  if (fs.existsSync(out) && fs.statSync(out).size > 100000) {
    console.log(`skip part-${idx}`);
    continue;
  }
  console.log(`render frame ${start}-${end} -> part-${idx}.mp4`);
  const r = spawnSync(
    remotion,
    ['render', comp, out, '--frames', `${start}-${end}`, '--codec', 'h264', '--crf', '19', '--concurrency', '2'],
    {stdio: 'inherit', cwd: ROOT}
  );
  if (r.status !== 0) {
    console.error(`Part ${idx} gagal.`);
    process.exit(1);
  }
}
console.log('Semua part selesai.');
