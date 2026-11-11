// Gabungkan bagian render -> master, mux dengan audio, dan jika perlu
// encode 2-pass agar muat batas upload 100 MB.

import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {FFMPEG} from './ffmpeg.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const type = process.argv[2] ?? 'long';
const run = (args, cwd = ROOT) => {
  const r = spawnSync(FFMPEG, args, {stdio: 'inherit', cwd});
  if (r.status !== 0) process.exit(1);
};

const partsDir = path.join(ROOT, 'out', `${type}-parts`);
const master = path.join(ROOT, 'out', `${type}-master.mp4`);
const audio = path.join(ROOT, 'out', `${type}-audio.m4a`);
const final = path.join(ROOT, 'out', `${type}-final.mp4`);

// 1) gabung part (jika ada)
if (fs.existsSync(partsDir)) {
  const parts = fs.readdirSync(partsDir).filter((f) => f.endsWith('.mp4')).sort();
  if (parts.length > 1) {
    fs.writeFileSync(path.join(partsDir, 'list.txt'), parts.map((p) => `file '${p}'`).join('\n'));
    console.log(`Gabung ${parts.length} part...`);
    run(['-y', '-hide_banner', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', path.join(partsDir, 'list.txt'), '-c', 'copy', master]);
  } else if (parts.length === 1) {
    fs.copyFileSync(path.join(partsDir, parts[0]), master);
  }
}
if (!fs.existsSync(master)) {
  console.error(`Master tidak ada: ${master}`);
  process.exit(1);
}

// 2) mux audio
console.log('Mux audio...');
run(['-y', '-hide_banner', '-loglevel', 'error', '-i', master, '-i', audio, '-map', '0:v:0', '-map', '1:a:0', '-c', 'copy', '-movflags', '+faststart', final]);

// 3) cek ukuran -> 2-pass bila > 92 MB
const LIMIT = 92 * 1024 * 1024;
const size = fs.statSync(final).size;
const timings = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', `timings-${type}.json`), 'utf8'));
const dur = timings.totalDuration;
console.log(`Final: ${(size / 1024 / 1024).toFixed(1)} MB, durasi ${dur.toFixed(1)}s`);
let upload = final;
if (size > LIMIT) {
  const totalKbps = Math.floor((LIMIT * 8) / dur / 1000);
  const vKbps = Math.max(1200, totalKbps - 256);
  console.log(`Terlalu besar -> encode 2-pass ${vKbps}kbps...`);
  const common = ['-c:v', 'libx264', '-preset', 'medium', '-b:v', `${vKbps}k`, '-maxrate', `${Math.round(vKbps * 1.45)}k`, '-bufsize', `${vKbps * 2}k`];
  run(['-y', '-hide_banner', '-loglevel', 'error', '-i', final, ...common, '-pass', '1', '-an', '-f', 'mp4', '/dev/null'], path.join(ROOT, 'out'));
  upload = path.join(ROOT, 'out', `${type}-upload.mp4`);
  run(['-y', '-hide_banner', '-loglevel', 'error', '-i', final, ...common, '-pass', '2', '-c:a', 'copy', '-movflags', '+faststart', upload], path.join(ROOT, 'out'));
  console.log(`Upload: ${(fs.statSync(upload).size / 1024 / 1024).toFixed(1)} MB`);
}
console.log(JSON.stringify({type, final, upload, sizeMB: +(fs.statSync(upload).size / 1024 / 1024).toFixed(1), duration: +dur.toFixed(1)}));
