import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import { CANVAS_HEIGHT, CANVAS_WIDTH} from './constants';
import GameOverScene from './scenes/GameOverScene';
import BootScene from './scenes/BootScene';

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
  scene: [BootScene, GameScene, GameOverScene],
};

new Phaser.Game(config);

