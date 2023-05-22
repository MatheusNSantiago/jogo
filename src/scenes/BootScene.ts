import { ASSETS_PATH } from "../constants";
import { loadAnimation } from "../utils";

class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: "SplashScene" });
  }

  preload() {
    // ╭──────────────────────────────────────────────────────────╮
    // │                           Map                            │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.image("tiles", `${ASSETS_PATH}/scenes/level1.png`);
    this.load.tilemapTiledJSON("level1", `${ASSETS_PATH}/scenes/level1.json`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                         Enemies                          │
    // ╰──────────────────────────────────────────────────────────╯

    loadAnimation(this, "enemy1", `${ASSETS_PATH}/sprites/enemy1`);
    loadAnimation(this, "enemy2", `${ASSETS_PATH}/sprites/enemy2`);
    loadAnimation(this, "enemy3", `${ASSETS_PATH}/sprites/enemy3`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                          Towers                          │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.atlas(
      "towers",
      `${ASSETS_PATH}/sprites/towers/towers.png`,
      `${ASSETS_PATH}/sprites/towers/towers.json`
    );

    // ╭──────────────────────────────────────────────────────────╮
    // │                        Power Ups                         │
    // ╰──────────────────────────────────────────────────────────╯

    loadAnimation(this, "explosion", `${ASSETS_PATH}/sprites/explosion`);

    // ╭──────────────────────────────────────────────────────────╮
    // │                           dock                           │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.atlas(
      "dock",
      `${ASSETS_PATH}/sprites/gui/dock/dock.png`,
      `${ASSETS_PATH}/sprites/gui/dock/dock.json`
    );

    // ╭──────────────────────────────────────────────────────────╮
    // │                           hud                            │
    // ╰──────────────────────────────────────────────────────────╯

    this.load.atlas(
      "hud",
      `${ASSETS_PATH}/sprites/gui/hud/hud.png`,
      `${ASSETS_PATH}/sprites/gui/hud/hud.json`
    );
  }

  create() {
    this.scene.start("GameScene");
  }
}

export default BootScene;
