import { CANVAS_HEIGHT } from '../constants';
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
      'towers',
      'assets/sprites/towers/towers.png',
      'assets/sprites/towers/towers.json'
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

    function addDockButton(
      scene: GameScene,
      order: number,
      buttonFrame: string,
      towerFrame: string
    ) {
      const padding = 20 * order;
      const dockButtonScale = 1.25;
      const dockButtonWidth = 171 * dockButtonScale;
      const dockButtonHeight = 210 * dockButtonScale;

      const button = scene.add
        .image(
          50 + padding + order * dockButtonWidth,
          CANVAS_HEIGHT - dockButtonHeight,
          'dock',
          buttonFrame
        )
        .setOrigin(0, 0)
        .setScale(dockButtonScale)
        .setDepth(100)
        .setInteractive();
      scene.input.setDraggable(button);

      var tower: Phaser.GameObjects.Image;
      button.on('dragstart', ({ x, y }: Phaser.Input.Pointer) => {
        tower = scene.add.image(x, y, 'towers', towerFrame).setInteractive();
        scene.input.setDraggable(tower);
      });
      button.on('drag', ({x, y}: Phaser.Input.Pointer) => {
        tower.setPosition(x, y)
      });
    }

    addDockButton(this, 0, 'archer-tower-card.png', 'archer-tower-front.png');
    addDockButton(this, 1, 'castle-tower-card.png', 'castle-tower-front.png');
    addDockButton(this, 2, 'knight-post-card.png', 'knight-post-front.png');
  }
}

export default GameScene;
