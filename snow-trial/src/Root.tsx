import {Composition} from 'remotion';
import {SnowTrial} from './SnowTrial';
import {FPS, HEIGHT, TOTAL_FRAMES, WIDTH} from './theme';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="SnowTrial"
    component={SnowTrial}
    durationInFrames={TOTAL_FRAMES}
    fps={FPS}
    width={WIDTH}
    height={HEIGHT}
  />
);
