import {Config} from '@remotion/cli/config';
import path from 'node:path';

// remotion.config.js dibundel sebagai CJS -> import.meta tidak tersedia; pakai cwd.
const here = process.cwd();

Config.setEntryPoint(path.join(here, 'src', 'index.js'));
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(85);
Config.setOverwriteOutput(true);
Config.setConcurrency(2);
Config.setChromiumOpenGlRenderer('swiftshader');
Config.setBrowserExecutable(path.join(here, 'scripts', 'chrome-wrapper.sh'));
Config.setDelayRenderTimeoutInMilliseconds(60000);
