import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const WIDTH = 1080;
export const HEIGHT = 1920;
export const FPS = 30;
export const TOTAL_FRAMES = 372; // 12.4 s, matches public/audio/vo.wav

// Shot starts (frames), cut to the voiceover lines
export const CUT = {street: 0, room: 42, portrait: 86, map: 146, pump: 210};

export const C = {
  crimson: '#d22b2b',
  ink: '#151515',
  paper: '#cfd4d8',
  cream: '#efe6d2',
};

export const DISPLAY = 'Inter Display';
export const SERIF = 'Liberation Serif';

loadFont({family: DISPLAY, url: staticFile('fonts/InterDisplay-Black.otf'), weight: '900'});
loadFont({family: DISPLAY, url: staticFile('fonts/InterDisplay-Bold.otf'), weight: '700'});
loadFont({family: SERIF, url: staticFile('fonts/LiberationSerif-BoldItalic.ttf'), weight: '700', style: 'italic'});
loadFont({family: SERIF, url: staticFile('fonts/LiberationSerif-Bold.ttf'), weight: '700'});
