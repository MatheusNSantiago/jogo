import { ASSETS_PATH } from '../constants';
import { loadAnimation } from '../utils';
import { GameStateInfo } from './GameScene';

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // ╭──────────────────────────────────────────────────────────╮
    // │                           Map                            │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.image('tiles', `${ASSETS_PATH}/scenes/level1.png`);
    this.load.tilemapTiledJSON('level1', `${ASSETS_PATH}/scenes/level1.json`);
    this.load.tilemapTiledJSON('level2', `${ASSETS_PATH}/scenes/level2.json`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                          Waves                           │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.json('level1-waves', `${ASSETS_PATH}/level1-waves.json`);
    this.load.json('level2-waves', `${ASSETS_PATH}/level2-waves.json`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                         Enemies                          │
    // ╰──────────────────────────────────────────────────────────╯

    loadAnimation(
      this,
      'skeleton1',
      `${ASSETS_PATH}/sprites/enemies/skeleton/skeleton1`
    );
    loadAnimation(
      this,
      'skeleton2',
      `${ASSETS_PATH}/sprites/enemies/skeleton/skeleton2`
    );
    loadAnimation(
      this,
      'skeleton3',
      `${ASSETS_PATH}/sprites/enemies/skeleton/skeleton3`
    );
    loadAnimation(this, 'ork1', `${ASSETS_PATH}/sprites/enemies/ork/ork1`);
    loadAnimation(this, 'ork2', `${ASSETS_PATH}/sprites/enemies/ork/ork2`);
    loadAnimation(this, 'ork3', `${ASSETS_PATH}/sprites/enemies/ork/ork3`);
    loadAnimation(this, 'golem', `${ASSETS_PATH}/sprites/enemies/golem`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                          Towers                          │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.atlas(
      'towers',
      `${ASSETS_PATH}/sprites/towers/towers.png`,
      `${ASSETS_PATH}/sprites/towers/towers.json`
    );

    this.load.image(
      'tower-upgrade',
      `${ASSETS_PATH}/sprites/gui/tower-upgrade.png`
    );

    // ╭──────────────────────────────────────────────────────────╮
    // │                        Power Ups                         │
    // ╰──────────────────────────────────────────────────────────╯

    loadAnimation(this, 'explosion', `${ASSETS_PATH}/sprites/explosion`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                           dock                           │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.atlas(
      'dock',
      `${ASSETS_PATH}/sprites/gui/dock/dock.png`,
      `${ASSETS_PATH}/sprites/gui/dock/dock.json`
    );

    this.load.image(
      'tower-cost-button',
      `${ASSETS_PATH}/sprites/gui/button.png`
    );
    // ╭──────────────────────────────────────────────────────────╮
    // │                           hud                            │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.atlas(
      'hud',
      `${ASSETS_PATH}/sprites/gui/hud/hud.png`,
      `${ASSETS_PATH}/sprites/gui/hud/hud.json`
    );
  }

  create() {
    this.scene.start('GameScene', { level: "level1"  } as GameStateInfo );
  }
}

export default BootScene;
