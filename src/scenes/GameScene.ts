import { CANVAS_HEIGHT } from "../constants";
import Tower from "../sprites/Tower";
import Enemy from "../sprites/enemy";

class GameScene extends Phaser.Scene {
  public enemies: Enemy[] = [];
  public towers: Tower[] = [];
  public gold = 100;

  private goldText!: Phaser.GameObjects.Text;
  private dockButtonsCount = 0;

  constructor() {
    super({ key: "GameScene" });
  }

  create() {
    const map = this.make.tilemap({ key: "level1" });
    const tileset = map.addTilesetImage("ground-tiles", "tiles");
    map.createLayer("Tile Layer 1", tileset!, 0, -220)!; // nem me pergunta pq desse -220
    this.createHUD();
    this.spawnEnemy();

    this.towers.push(
      new Tower(
        this,
        this.enemies,
        "castle-tower-front.png",
        800,
        750,
        600,
        40,
      ).setActive(true)
    );

    // this.enemies.push(
    //   new Enemy(this, {
    //     hp: 100,
    //     velocity: 180,
    //     reward: 20,
    //   })
    // );

    this.events.on("enemy-killed", (enemy: Enemy) => {
      // Evita que o inimigo seja contabilizado mais de uma vez
      // se o inimigo não tiver recompensa, quer dizer que ele já foi contabilizado
      if (enemy.reward === 0) return;

      this.gold += enemy.extractReward();
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
      .setInteractive({ cursor: "grab" });
    this.input.setDraggable(button);

    var tower: Tower;
    button.on("dragstart", ({ x, y }: Phaser.Input.Pointer) => {
      tower = new Tower(this, this.enemies, towerFrame, x, y);
      tower.setInteractive({ cursor: "grabbing" });
      this.input.setDraggable(tower);
    });
    button.on("drag", ({ x, y }: Phaser.Input.Pointer) => {
      tower.setPosition(x, y);
      tower.update();
    });
    button.on("dragend", () => {
      tower.enable();
      this.towers.push(tower);
    });

    this.dockButtonsCount++;
  }
}

export default GameScene;
