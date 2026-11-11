// Ukur durasi WAV (parse header RIFF), hitung timing komposisi, tulis:
//   src/timings-long.json / src/timings-short.json  (dipakai Remotion)
//   out/events-long.json  / out/events-short.json   (dipakai synth ambience)

import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {longScenes, shortScenes} from '../src/story.js';
import {FPS, LONG, SHORT} from '../src/config.js';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');

const wavDuration = (file) => {
  const fd = fs.openSync(file, 'r');
  const size = fs.fstatSync(fd).size;
  const head = Buffer.alloc(12);
  fs.readSync(fd, head, 0, 12, 0);
  if (head.toString('ascii', 0, 4) !== 'RIFF' || head.toString('ascii', 8, 12) !== 'WAVE') {
    fs.closeSync(fd);
    throw new Error(`bukan WAV: ${file}`);
  }
  let pos = 12;
  let byteRate = 48000;
  let dataSize = 0;
  while (pos < size - 8) {
    const ch = Buffer.alloc(8);
    fs.readSync(fd, ch, 0, 8, pos);
    const id = ch.toString('ascii', 0, 4);
    const sz = ch.readUInt32LE(4);
    if (id === 'fmt ') {
      const b = Buffer.alloc(Math.max(sz, 16));
      fs.readSync(fd, b, 0, sz, pos + 8);
      byteRate = b.readUInt32LE(8) || 48000;
    } else if (id === 'data') {
      dataSize = sz;
    }
    pos += 8 + sz + (sz % 2);
  }
  fs.closeSync(fd);
  return dataSize / byteRate;
};

const build = (type, scenes, cfg, extra) => {
  const audioDir = path.join(ROOT, 'audio', type);
  const out = {fps: FPS, scenes: []};
  let from = 0;
  for (const part of extra.head ?? []) {
    out[part.key] = {from, frames: Math.round(part.dur * FPS)};
    from += Math.round(part.dur * FPS);
  }
  const thunders = [];
  const booms = [];
  const risers = [];
  for (const ev of extra.preEvents ?? []) {
    if (ev.kind === 'thunder') thunders.push(ev.t);
    if (ev.kind === 'boom') booms.push(ev.t);
  }
  for (const sc of scenes) {
    const voDur = wavDuration(path.join(audioDir, `${sc.vo}.wav`));
    const frames = Math.round((cfg.padIn + voDur + cfg.padOut) * FPS);
    const voStart = from / FPS + cfg.padIn;
    out.scenes.push({id: sc.id, from, frames, voDur, voStart});
    if (extra.boomScenes?.includes(sc.id)) booms.push(from / FPS + 0.15);
    if (sc.thunderAt != null) thunders.push(voStart + sc.thunderAt * voDur);
    from += frames;
  }
  for (const part of extra.tail ?? []) {
    out[part.key] = {from, frames: Math.round(part.dur * FPS)};
    if (part.boom) booms.push(from / FPS + 0.12);
    if (part.thunder) thunders.push(from / FPS + part.thunder);
    if (part.riser) risers.push([from / FPS - part.riser, from / FPS]);
    from += Math.round(part.dur * FPS);
  }
  out.totalFrames = from;
  out.totalDuration = from / FPS;
  return {timings: out, events: {duration: out.totalDuration + 0.4, booms, thunders, risers}};
};

const longBuilt = build('long', longScenes, LONG, {
  head: [
    {key: 'prehook', dur: LONG.prehook},
    {key: 'title', dur: LONG.title},
  ],
  preEvents: [
    {kind: 'boom', t: 0.45},
    {kind: 'thunder', t: 0.5},
  ],
  boomScenes: ['s1', 's5', 's6', 's10'],
  tail: [{key: 'outro', dur: LONG.outro, boom: true}],
});

// tambah thunder untuk title card
longBuilt.events.thunders.push(longBuilt.timings.title.from / FPS + 2.6);
longBuilt.events.risers.push([longBuilt.timings.title.from / FPS - 3.0, longBuilt.timings.title.from / FPS]);

const shortBuilt = build('short', shortScenes, SHORT, {
  head: [],
  boomScenes: ['h1', 'h2', 'h3', 'h4'],
  tail: [{key: 'endcard', dur: SHORT.endcard, boom: true, thunder: 0.8, riser: 2.4}],
});

for (const [type, built] of [['long', longBuilt], ['short', shortBuilt]]) {
  fs.writeFileSync(path.join(ROOT, 'src', `timings-${type}.json`), JSON.stringify(built.timings, null, 2));
  fs.mkdirSync(path.join(ROOT, 'out'), {recursive: true});
  fs.writeFileSync(path.join(ROOT, 'out', `events-${type}.json`), JSON.stringify(built.events, null, 2));
  console.log(`[${type}] total ${(built.timings.totalDuration / 60).toFixed(2)} menit (${built.timings.totalFrames} frame @${FPS}fps)`);
  for (const s of built.timings.scenes) {
    console.log(`  ${s.id}: vo ${s.voDur.toFixed(2)}s, mulai ${s.voStart.toFixed(2)}s`);
  }
}
