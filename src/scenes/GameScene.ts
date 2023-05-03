import { CANVAS_HEIGHT } from '../constants';
import Enemy from '../sprites/Enemy';
import { BlueElf } from '../sprites/Tower';

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

    this.load.atlas(
      'elves',
      'assets/sprites/elves/elves.png',
      'assets/sprites/elves/elves.json'
    );
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('ground-tiles', 'tiles');
    map.createLayer('Tile Layer 1', tileset!, 0, -220)!; // nem me pergunta pq desse -220
    this.createHUD();

    this.spawnEnemy();

    this.anims.create({
      key: 'greenIdle',
      frames: this.anims.generateFrameNames('elves', {
        prefix: 'green_idle_',
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.anims.create({
      key: 'blueIdle',
      frames: this.anims.generateFrameNames('elves', {
        prefix: 'blue_idle_',
        start: 0,
        end: 4,
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.anims.create({
      key: 'greenAttack',
      frames: this.anims.generateFrameNames('elves', {
        prefix: 'green_attack_',
        start: 0,
        end: 5,
      }),
      frameRate: 10,
    });
    this.anims.create({
      key: 'blueAttack',
      frames: this.anims.generateFrameNames('elves', {
        prefix: 'blue_attack_',
        start: 0,
        end: 4,
      }),
      frameRate: 10,
    });

    this.anims.create({
      key: 'greenDead',
      frames: this.anims.generateFrameNames('elves', {
        prefix: 'green_die_',
        start: 0,
        end: 4,
      }),
      frameRate: 6,
    });
    this.anims.create({
      key: 'blueDead',
      frames: this.anims.generateFrameNames('elves', {
        prefix: 'blue_die_',
        start: 0,
        end: 4,
      }),
      frameRate: 6,
    });

    new BlueElf(this, 500, 500).setScale(1.5);
  }

  spawnEnemy() {
    this.time.delayedCall(Phaser.Math.Between(1000, 8000), () => {
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
      button.on('drag', ({ x, y }: Phaser.Input.Pointer) => {
        tower.setPosition(x, y);
      });
    }

    addDockButton(this, 0, 'archer-tower-card.png', 'archer-tower-front.png');
    addDockButton(this, 1, 'castle-tower-card.png', 'castle-tower-front.png');
    addDockButton(this, 2, 'knight-post-card.png', 'knight-post-front.png');
  }
}

export default GameScene;
