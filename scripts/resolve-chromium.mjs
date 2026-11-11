import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import {execSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import chromium from '@sparticuz/chromium';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const LIB_DIR = '/tmp/kisahmana-chromium-libs';

// Biner Chromium dari paket npm + library NSS/NSPR dari al2023.tar.br
const exe = await chromium.executablePath();

if (!fs.existsSync(path.join(LIB_DIR, 'libnspr4.so'))) {
  const br = fs.readFileSync(path.join(ROOT, 'node_modules', '@sparticuz', 'chromium', 'bin', 'al2023.tar.br'));
  const tar = '/tmp/kisahmana-al2023.tar';
  fs.writeFileSync(tar, zlib.brotliDecompressSync(br));
  fs.mkdirSync(LIB_DIR, {recursive: true});
  execSync(`tar -xf ${tar} -C ${LIB_DIR} --strip-components=1`);
}

process.stdout.write(exe);
