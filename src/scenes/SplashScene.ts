import { ASSETS_PATH } from "../constants";

class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
  }

  preload() {
    // Map
    this.load.image("tiles", `${ASSETS_PATH}/scenes/level1.png`);
    this.load.tilemapTiledJSON("level1", `${ASSETS_PATH}/scenes/level1.json`);
    // Enemies
    this.load.multiatlas(
      "enemy1",
      `${ASSETS_PATH}/sprites/enemy1/enemy1.json`,
      `${ASSETS_PATH}/sprites/enemy1`
    );
    this.load.json("enemy1-json",`${ASSETS_PATH}/sprites/enemy1/enemy1.json`),

    this.load.multiatlas(
      "enemy2",
      `${ASSETS_PATH}/sprites/enemy2/enemy2.json`,
      `${ASSETS_PATH}/sprites/enemy2`,
    );
    this.load.json("enemy2-json",`${ASSETS_PATH}/sprites/enemy2/enemy2.json`),
    this.load.multiatlas(
      "enemy3",
      `${ASSETS_PATH}/sprites/enemy3/enemy3.json`,
      `${ASSETS_PATH}/sprites/enemy3`,
    );
    this.load.json("enemy3-json",`${ASSETS_PATH}/sprites/enemy3/enemy3.json`),

    // dock
    this.load.atlas(
      "towers",
      `${ASSETS_PATH}/sprites/towers/towers.png`,
      `${ASSETS_PATH}/sprites/towers/towers.json`
    );

    // dock
    this.load.atlas(
      "dock",
      `${ASSETS_PATH}/sprites/gui/dock/dock.png`,
      `${ASSETS_PATH}/sprites/gui/dock/dock.json`
    );

    // hud
    this.load.atlas(
      "hud",
      `${ASSETS_PATH}/sprites/gui/hud/hud.png`,
      `${ASSETS_PATH}/sprites/gui/hud/hud.json`
    );
  }


  create() {
    this.scene.start('GameScene');
  }
}

export default SplashScene;
