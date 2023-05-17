import { CANVAS_HEIGHT  } from '../../constants';
import Barrier from '../../sprites/Barrier';
import Enemy from '../../sprites/Enemy';
import Tower from '../../sprites/Tower';
import GameScene from '../GameScene';

class Hud extends Phaser.GameObjects.Container {
  declare scene: GameScene;

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

    // this.addDockButton('power1.png', 'knight-post-front.png');
    this.addCoiso();
    // this.addDockButton('power3.png', 'knight-post-front.png');
  }

  updateGold(gold: number) {
    this.goldText.setText(gold.toString()).setDepth(100);
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
      .sprite(x, y, 'hud', 'health.png')
      .setOrigin(0, 0)
      .setDepth(100);
    return this.scene.add
      .sprite(x + 100, y + 20.5, 'hud', 'health-bar.png')
      .setOrigin(0, 0)
      .setDepth(101);
  }

  private makeGoldCounter(initialGold: number, x: number, y: number) {
    this.scene.add
      .sprite(x, y, 'hud', 'gold.png')
      .setOrigin(0, 0)
      .setDepth(100);

    return this.scene.add
      .text(x + 65, y + 20, initialGold.toString(), {
        fontSize: '44px',
        color: '#fff',
      })
      .setDepth(101);
  }

  private addDockButton(buttonFrame: string, frame: string) {
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

    Tower.dragAndDrop(this.scene, button, frame);

    this.dockButtonsCount++;
  }


  addCoiso() {
    const buttonFrame = 'power2.png';

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

    Barrier.dragAndDrop(this.scene, button)
  }
}

export default Hud;
