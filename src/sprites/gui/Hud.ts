import {
  ARCHER_TOWER,
  CANVAS_HEIGHT,
  CASTLE_TOWER,
  KNIGHT_FORT,
} from "../../constants";
import GameScene from "../../scenes/GameScene";
import Barrier from "../../sprites/Barrier";
import Bomb from "../../sprites/Bomb";
import Tower, { TowerConfig } from "../../sprites/Tower";

class Hud extends Phaser.GameObjects.Container {
  declare scene: GameScene;

  private dockButtonsCount = 0;
  private goldText: Phaser.GameObjects.Text;
  private energyText: Phaser.GameObjects.Text;
  private healthBar: Phaser.GameObjects.Sprite;
  private initialHealth: number;

  constructor(scene: GameScene) {
    super(scene);
    this.initialHealth = scene.health;
    this.scene.add.image(1000, 500, "tower-cost-button");

    this.healthBar = this.makeHealthBar(10, 35);
    this.goldText = this.makeCounter(scene.gold, 20, 230, "gold.png");
    this.energyText = this.makeCounter(scene.energy, 20, 130, "energy.png");

    this.addTowerDockButton(ARCHER_TOWER);
    this.addTowerDockButton(CASTLE_TOWER);
    this.addTowerDockButton(KNIGHT_FORT);

    this.addPowerUpDockButton("power2.png");
    this.addPowerUpDockButton("power3.png");
  }

  updateGold(gold: number) {
    this.goldText.setText(gold.toString()).setDepth(100);
  }

  updateEnergy(energy: number) {
    this.energyText.setText(energy.toString()).setDepth(100);
  }

  updateHealthBar(health: number) {
    const percent = health / this.initialHealth;
    this.healthBar.setCrop(
      0,
      0,
      this.healthBar.width * percent,
      this.healthBar.height
    );
  }

  private makeHealthBar(x: number, y: number) {
    this.scene.add
      .sprite(x, y, "hud", "health.png")
      .setOrigin(0, 0)
      .setDepth(100);
    return this.scene.add
      .sprite(x + 100, y + 20.5, "hud", "health-bar.png")
      .setOrigin(0, 0)
      .setDepth(101);
  }

  private makeCounter(
    initialGold: number,
    x: number,
    y: number,
    sprite: string
  ) {
    this.scene.add.sprite(x, y, "hud", sprite).setOrigin(0, 0).setDepth(100);

    return this.scene.add
      .text(x + 65, y + 20, initialGold.toString(), {
        fontSize: "44px",
        color: "#fff",
      })
      .setDepth(101);
  }

  private addTowerDockButton(towerConfig: TowerConfig) {
    const buttonFrame = `${towerConfig.type}-tower-card.png`;

    const button = this.getDockButton(buttonFrame);
    const x = button.x + button.width / 2;
    const y = button.y + button.height + 6;
    this.scene.add
      .image(x, y, "tower-cost-button")
      .setDepth(100)
      .setOrigin(0.3, 0);
    this.scene.add
      .text(x + 10, y + 9, towerConfig.cost.toString(), { fontSize: "32.5px" })
      .setDepth(101)
      .setOrigin(0.2, 0);
    Tower.dragAndDrop(this.scene, button, towerConfig);
  }

  private addPowerUpDockButton(buttonFrame: string) {
    const button = this.getDockButton(buttonFrame);

    switch (buttonFrame) {
      case "power2.png":
        return Barrier.dragAndDrop(this.scene, button);
      case "power3.png":
        return Bomb.dragAndDrop(this.scene, button);
    }
  }

  private getDockButton(buttonFrame: string) {
    const padding = 20 * this.dockButtonsCount;
    const dockButtonScale = 1.25;
    const dockButtonWidth = 171 * dockButtonScale;
    const dockButtonHeight = 210 * dockButtonScale;

    const button = this.scene.add
      .image(
        50 + padding + this.dockButtonsCount * dockButtonWidth,
        CANVAS_HEIGHT - dockButtonHeight - 20,
        "dock",
        buttonFrame
      )
      .setOrigin(0, 0)
      .setScale(dockButtonScale)
      .setDepth(100)
      .setInteractive({ cursor: "grab" });

    this.scene.input.setDraggable(button);
    this.dockButtonsCount++;
    return button;
  }
}

export default Hud;
