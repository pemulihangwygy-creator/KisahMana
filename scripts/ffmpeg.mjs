import {execSync} from 'node:child_process';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';

let resolved = ffmpegInstaller.path;
try {
  const fromPath = execSync('command -v ffmpeg', {stdio: ['ignore', 'pipe', 'ignore']}).toString().trim();
  if (fromPath) resolved = fromPath;
} catch {
  // fallback ke @ffmpeg-installer
}
export const FFMPEG = process.env.FFMPEG_PATH || resolved;
