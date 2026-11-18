import {Composition} from 'remotion';
import {MeghdootCrane} from './MeghdootCrane';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="MeghdootCrane"
    component={MeghdootCrane}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
