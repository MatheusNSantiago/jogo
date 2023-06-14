import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import { CANVAS_HEIGHT, CANVAS_WIDTH} from './constants';
import GameOverScene from './scenes/GameOverScene';
import BootScene from './scenes/BootScene';
import LevelCompleteScene from './scenes/LevelCompleteScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  height: CANVAS_HEIGHT,
  width: CANVAS_WIDTH,
  fps: { limit: 25 },
  transparent: true,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [BootScene, GameScene, LevelCompleteScene, GameOverScene],
};

new Phaser.Game(config);

