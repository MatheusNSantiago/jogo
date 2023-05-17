class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
  }

  preload() {
    // Map
    this.load.image("tiles", "src/assets/scenes/level1.png");
    this.load.tilemapTiledJSON("level1", "src/assets/scenes/level1.json");

    // Enemies
    this.load.multiatlas(
      "enemy1",
      "src/assets/sprites/enemy1/enemy1.json",
      "src/assets/sprites/enemy1"
    );
    this.load.json("enemy1-json","src/assets/sprites/enemy1/enemy1.json"),

    this.load.multiatlas(
      "enemy2",
      "src/assets/sprites/enemy2/enemy2.json",
      "src/assets/sprites/enemy2",
    );
    this.load.json("enemy2-json","src/assets/sprites/enemy2/enemy2.json"),
    this.load.multiatlas(
      "enemy3",
      "src/assets/sprites/enemy3/enemy3.json",
      "src/assets/sprites/enemy3",
    );
    this.load.json("enemy3-json","src/assets/sprites/enemy3/enemy3.json"),

    // dock
    this.load.atlas(
      "towers",
      "src/assets/sprites/towers/towers.png",
      "src/assets/sprites/towers/towers.json"
    );

    // dock
    this.load.atlas(
      "dock",
      "src/assets/sprites/gui/dock/dock.png",
      "src/assets/sprites/gui/dock/dock.json"
    );

    // hud
    this.load.atlas(
      "hud",
      "src/assets/sprites/gui/hud/hud.png",
      "src/assets/sprites/gui/hud/hud.json"
    );
  }


  create() {
    this.scene.start('GameScene');
  }
}

export default SplashScene;
