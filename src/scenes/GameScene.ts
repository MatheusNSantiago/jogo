import { CANVAS_HEIGHT } from "../constants";
import Enemy from "../sprites/Enemy";
import Tower from "../sprites/Tower";

class GameScene extends Phaser.Scene {
  public enemies: Enemy[] = [];
  public towers: Tower[] = [];
  public gold = 100;

  private goldText!: Phaser.GameObjects.Text;
  private dockButtonsCount = 0;

  constructor() {
    super({ key: "GameScene" });
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

    this.load.atlas(
      "elves",
      "assets/sprites/elves/elves.png",
      "assets/sprites/elves/elves.json"
    );
  }

  create() {
    const map = this.make.tilemap({ key: "level1" });
    const tileset = map.addTilesetImage("ground-tiles", "tiles");
    map.createLayer("Tile Layer 1", tileset!, 0, -220)!; // nem me pergunta pq desse -220
    this.createHUD();
    this.spawnEnemy();

    this.events.on("enemy-killed", (enemy: Enemy) => {
      // checa se a morte já foi contabilizada
      console.log(enemy.active);

      this.gold += enemy.reward;
      this.goldText.setText(`Gold: ${this.gold}`);
    });
  }

  spawnEnemy() {
    const baseDelay = 1000;
    const variableDelay = 8000;

    this.time.delayedCall(baseDelay + Math.random() * variableDelay, () => {
      this.enemies.push(
        new Enemy(this, {
          hp: 100,
          velocity: 180,
          reward: 20,
        })
      );
      this.spawnEnemy();
    });
  }

  update() {
    if (this.enemies.length === 30) return;
    for (const enemy of this.enemies) {
      if (enemy.active) {
        enemy.update();
      }
    }
    for (const tower of this.towers) tower.update();
  }

  createHUD() {
    this.goldText = this.add.text(10, 10, `Gold: ${this.gold}`, {
      fontSize: "64px",
      color: "#fff",
    });

    this.addDockButton("archer-tower-card.png", "archer-tower-front.png");
    this.addDockButton("castle-tower-card.png", "castle-tower-front.png");
    this.addDockButton("knight-post-card.png", "knight-post-front.png");
  }

  addDockButton(buttonFrame: string, towerFrame: string) {
    const padding = 20 * this.dockButtonsCount;
    const dockButtonScale = 1.25;
    const dockButtonWidth = 171 * dockButtonScale;
    const dockButtonHeight = 210 * dockButtonScale;

    const button = this.add
      .image(
        50 + padding + this.dockButtonsCount * dockButtonWidth,
        CANVAS_HEIGHT - dockButtonHeight,
        "dock",
        buttonFrame
      )
      .setOrigin(0, 0)
      .setScale(dockButtonScale)
      .setDepth(100)
      .setInteractive();
    this.input.setDraggable(button);

    var tower: Tower;
    button.on("dragstart", ({ x, y }: Phaser.Input.Pointer) => {
      tower = new Tower(this, this.enemies, towerFrame, x, y);
      tower.setInteractive();
      this.input.setDraggable(tower);
    });
    button.on("drag", ({ x, y }: Phaser.Input.Pointer) => {
      tower.setPosition(x, y);
      tower.update();
    });
    button.on("dragend", ({ x, y }: Phaser.Input.Pointer) => {
      tower.enable();
      this.towers.push(tower);
    });

    this.dockButtonsCount++;
  }
}

export default GameScene;
