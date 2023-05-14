import { CANVAS_HEIGHT } from '../constants';
import Tower from '../sprites/Tower';
import Enemy from '../sprites/enemy';

class GameScene extends Phaser.Scene {
  public enemies: Enemy[] = [];
  public towers: Tower[] = [];
  public gold = 100;
  public health = 60;
  private HUD!: Hud;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('ground-tiles', 'tiles');
    map.createLayer('Tile Layer 1', tileset!, 0, -220)!; // nem me pergunta pq desse -220
    this.HUD = new Hud(this);
    this.spawnEnemy();

    this.towers.push(
      new Tower(
        this,
        this.enemies,
        'castle-tower-front.png',
        800,
        750,
        600,
        40
      ).setActive(true)
    );
    this.events.on('enemy-killed', (enemy: Enemy) => {
      // Evita que o inimigo seja contabilizado mais de uma vez
      // se o inimigo não tiver recompensa, quer dizer que ele já foi contabilizado
      if (enemy.reward === 0) return;

      this.gold += enemy.extractReward();
      this.HUD.updateGold(this.gold);
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
}

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

export default GameScene;
