import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import { CANVAS_HEIGHT, CANVAS_WIDTH} from './constants';
import SplashScene from './scenes/SplashScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  height: CANVAS_HEIGHT,
  width: CANVAS_WIDTH,
  transparent: true,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [SplashScene, GameScene],
};

new Phaser.Game(config);

