import {Composition} from 'remotion';
import {MeghdootOSH} from './MeghdootOSH';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MeghdootOSH"
    component={MeghdootOSH}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
