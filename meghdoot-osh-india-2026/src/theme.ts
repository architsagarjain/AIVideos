import {loadFont} from '@remotion/fonts';
import {staticFile} from 'remotion';

export const WIDTH = 1080;
export const HEIGHT = 1350;
export const FPS = 30;
// "Inspired" runs at 120 BPM: one beat = 15 frames, one bar = 60 frames.
export const BEAT = 15;
export const BAR = 60;
export const TOTAL_FRAMES = 1680;

// Meghdoot brand colours: primary orange + blue, light secondary.
export const C = {
  orange: '#F1682B',
  orangeDeep: '#D9561C',
  blue: '#0585C3',
  blueDeep: '#04689A',
  light: '#F4F4F6',
  white: '#FFFFFF',
  ink: '#1D2433',
  muted: '#5E6573',
  hairline: '#E2E4EA',
};

export const brandGradient = `linear-gradient(90deg, ${C.orange} 0%, ${C.blue} 100%)`;

// Shared page layout for photo sections: header, photo card, caption area.
export const CARD = {x: 40, y: 160, w: 1000, h: 900};
export const CAPTION_TOP = 1112;

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
