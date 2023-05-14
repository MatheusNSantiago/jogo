class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
  }

  preload() {
    // Map
    this.load.image("tiles", "assets/scenes/level1.png");
    this.load.tilemapTiledJSON("level1", "assets/scenes/level1.json");

    // Enemies
    this.load.multiatlas(
      "enemy",
      "assets/sprites/enemy1/enemy1.json",
      "assets/sprites/enemy1"
    );

    // dock
    this.load.atlas(
      "towers",
      "assets/sprites/towers/towers.png",
      "assets/sprites/towers/towers.json"
    );

    // dock
    this.load.atlas(
      "dock",
      "assets/sprites/gui/dock/dock.png",
      "assets/sprites/gui/dock/dock.json"
    );

    // hud
    this.load.atlas(
      "hud",
      "assets/sprites/gui/hud/hud.png",
      "assets/sprites/gui/hud/hud.json"
    );
  }


  create() {
    this.scene.start('GameScene');
  }
}

export default SplashScene;
