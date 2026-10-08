import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const WIDTH = 1080;
export const HEIGHT = 1350;
export const FPS = 30;
// "Inspired" runs at 120 BPM: one beat = 15 frames, one bar = 60 frames.
export const BEAT = 15;
export const BAR = 60;
export const TOTAL_FRAMES = 1680;

// Colours sampled from the Meghdoot logo.
export const C = {
  orange: '#F7931E',
  orangeDeep: '#EE4A23',
  blue: '#1E9AD6',
  blueDeep: '#155C8E',
  grey: '#6D6E71',
  navy: '#0B1C33',
  navyDeep: '#061223',
  white: '#FFFFFF',
  offWhite: '#F5F7FA',
};

export const brandGradient = `linear-gradient(90deg, ${C.orangeDeep} 0%, ${C.orange} 45%, ${C.blue} 100%)`;

export const FONT_DISPLAY = 'Inter Display';
export const FONT_TEXT = 'Inter';

const fonts: [string, string, string][] = [
  [FONT_DISPLAY, 'fonts/InterDisplay-Black.otf', '900'],
  [FONT_DISPLAY, 'fonts/InterDisplay-ExtraBold.otf', '800'],
  [FONT_DISPLAY, 'fonts/InterDisplay-Bold.otf', '700'],
  [FONT_DISPLAY, 'fonts/InterDisplay-SemiBold.otf', '600'],
  [FONT_TEXT, 'fonts/Inter-Medium.otf', '500'],
  [FONT_TEXT, 'fonts/Inter-Regular.otf', '400'],
];

for (const [family, file, weight] of fonts) {
  loadFont({family, url: staticFile(file), weight});
}

export const photo = (n: number) => staticFile(`photos/p${String(n).padStart(2, '0')}.jpg`);
