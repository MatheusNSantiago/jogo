import * as Phaser from 'phaser';
import GameScene from './scenes/GameScene';
import SplashScene from './scenes/SplashScene';
import SnowGame from './scenes/snow/SnowGame';
import { TILE_SIZE } from './constants';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  pixelArt: true,
  height: TILE_SIZE * (6 + 0),
  width: TILE_SIZE * 11,
  transparent: true,
  scale: {
    parent: 'game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  // scene: [SplashScene, LoadScene, GameScene],
  scene: [GameScene],
};

new Phaser.Game(config);

