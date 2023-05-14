import { CANVAS_HEIGHT } from "../../constants";
import Tower from "../../sprites/Tower";
import Enemy from "../../sprites/enemy";
import GameScene from "../GameScene";

class Hud extends Phaser.GameObjects.Container {
  private dockButtonsCount = 0;
  private goldText: Phaser.GameObjects.Text;
  private healthBar: Phaser.GameObjects.Sprite;
  private initialHealth: number;
  private enemies: Enemy[];
  private towers: Tower[];

  constructor(scene: GameScene) {
    super(scene);
    this.enemies = scene.enemies;
    this.towers = scene.towers;
    this.initialHealth = scene.health;

    this.healthBar = this.makeHealthBar(10, 35);
    this.goldText = this.makeGoldCounter(scene.gold, 20, 130);

    this.addDockButton('archer-tower-card.png', 'archer-tower-front.png');
    this.addDockButton('castle-tower-card.png', 'castle-tower-front.png');
    this.addDockButton('knight-post-card.png', 'knight-post-front.png');
  }

  updateGold(gold: number) {
    this.goldText.setText(gold.toString());
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
    this.scene.add.sprite(x, y, 'hud', 'health.png').setOrigin(0,0);
    return this.scene.add.sprite(x + 100, y + 20.5, 'hud', 'health-bar.png').setOrigin(0,0)
  }

  private makeGoldCounter(initialGold: number, x: number, y:number) {
    this.scene.add.sprite(x, y, 'hud', 'gold.png').setOrigin(0,0);
    return this.scene.add.text(x + 65, y + 20, initialGold.toString(), {
      fontSize: '44px',
      color: '#fff',
    });
  }

  private addDockButton(buttonFrame: string, towerFrame: string) {
    const padding = 20 * this.dockButtonsCount;
    const dockButtonScale = 1.25;
    const dockButtonWidth = 171 * dockButtonScale;
    const dockButtonHeight = 210 * dockButtonScale;

    const button = this.scene.add
      .image(
        50 + padding + this.dockButtonsCount * dockButtonWidth,
        CANVAS_HEIGHT - dockButtonHeight,
        'dock',
        buttonFrame
      )
      .setOrigin(0, 0)
      .setScale(dockButtonScale)
      .setDepth(100)
      .setInteractive({ cursor: 'grab' });
    this.scene.input.setDraggable(button);

    var tower: Tower;
    button.on('dragstart', ({ x, y }: Phaser.Input.Pointer) => {
      tower = new Tower(this.scene, this.enemies, towerFrame, x, y);
      tower.setInteractive({ cursor: 'grabbing' });
      this.scene.input.setDraggable(tower);
    });
    button.on('drag', ({ x, y }: Phaser.Input.Pointer) => {
      tower.setPosition(x, y);
      tower.update();
    });
    button.on('dragend', () => {
      tower.enable();
      this.towers.push(tower);
    });
    this.dockButtonsCount++;
  }
}

export default Hud;
