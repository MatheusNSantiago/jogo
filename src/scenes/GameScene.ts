import { CANVAS_HEIGHT, CANVAS_WIDTH } from '../constants';
import Enemy from '../sprites/Enemy';

class GameScene extends Phaser.Scene {
  private enemies: Enemy[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Map
    this.load.image('tiles', 'assets/scenes/level1.png');
    this.load.tilemapTiledJSON('level1', 'assets/scenes/level1.json');

    // Enemies
    this.load.multiatlas(
      'enemy',
      'assets/sprites/enemy1/enemy1.json',
      'assets/sprites/enemy1'
    );

    // dock
    this.load.atlas(
      'dock',
      'assets/sprites/gui/dock/dock.png',
      'assets/sprites/gui/dock/dock.json'
    );
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('ground-tiles', 'tiles');
    map.createLayer('Tile Layer 1', tileset!, 0, -220)!; // nem me pergunta pq desse -220
    this.createHUD();

    this.spawnEnemy();
  }

  spawnEnemy() {
    const baseDelay = 1000;
    const variableDelay = 8000;

    this.time.delayedCall(baseDelay + Math.random() * variableDelay, () => {
      this.enemies.push(new Enemy(this));
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
  }

  createHUD() {
    this.add.text(10, 10, 'Gold: 0', {
      fontSize: '64px',
      color: '#fff',
    });

    // ╭──────────────────────────────────────────────────────────╮
    // │                       Dock buttons                       │
    // ╰──────────────────────────────────────────────────────────╯
    const dockButtonScale = 1.25;
    const dockButtonWidth = 171 * dockButtonScale;
    const dockButtonHeight = 210 * dockButtonScale;
    const dockButtonY = CANVAS_HEIGHT - dockButtonHeight;

    this.add
      .image(50, dockButtonY, 'dock', 'archer-tower-card.png')
      .setOrigin(0, 0)
      .setScale(dockButtonScale)
      .setDepth(100)
      .setInteractive()
      .on('pointerdown', () => {
        console.log('archer-tower-card');
      });

    this.add
      .image(70 + dockButtonWidth, dockButtonY, 'dock', 'castle-tower-card.png')
      .setOrigin(0, 0)
      .setScale(dockButtonScale)
      .setDepth(100);

    this.add
      .image(
        90 + 2 * dockButtonWidth,
        dockButtonY,
        'dock',
        'knight-post-card.png'
      )
      .setOrigin(0, 0)
      .setScale(dockButtonScale)
      .setDepth(100);
  }
}

export default GameScene;
