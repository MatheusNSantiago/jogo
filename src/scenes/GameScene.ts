import { TILE_SIZE } from '../constants';
import Enemy from '../sprites/Enemy';

class GameScene extends Phaser.Scene {
  private enemies: Enemy[] = [];

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    this.load.image('tiles', 'assets/scenes/level1.png');
    this.load.tilemapTiledJSON('level1', 'assets/scenes/level1.json');
    this.load.multiatlas(
      'enemy',
      'assets/sprites/enemy1/enemy1.json',
      'assets/sprites/enemy1'
    );
  }
  create() {
    const map = this.make.tilemap({ key: 'level1' });

    const tileset = map.addTilesetImage('ground-tiles', 'tiles');
    map.createLayer('Tile Layer 1', tileset!, 0, -220)!; // nem me pergunta pq desse -220

    this.spawnEnemy();
  }

  spawnEnemy() {
    this.time.delayedCall(1000 + Math.random() * 8000, () => {
        this.enemies.push(new Enemy(this, 0, 0));
      this.spawnEnemy();
    })
  }

  update() {
    for (const enemy of this.enemies) enemy.update(); // update enemies
  }
}

export default GameScene;

class Turret extends Phaser.GameObjects.Sprite { }
