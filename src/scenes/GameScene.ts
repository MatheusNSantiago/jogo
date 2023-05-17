import { PATH_LEVEL_1, enemy1, enemy2, enemy3 } from '../constants';
import Tower from '../sprites/Tower';
import Enemy from '../sprites/enemy';
import Hud from './components/Hud';

class GameScene extends Phaser.Scene {
  public enemies!: Enemy[];
  public towers!: Tower[];
  public path : Phaser.Curves.Path;

  public health!: number;
  public gold!: number;
  private HUD!: Hud;

  constructor() {
    super({ key: 'GameScene' });

    this.path = this.generatePath(PATH_LEVEL_1);
  }

  init() {
    this.enemies = [];
    this.towers = [];
    this.gold = 100;
    this.health = 60;
    this.HUD = new Hud(this);
  }

  create() {
    const map = this.make.tilemap({ key: 'level1' });
    const tileset = map.addTilesetImage('ground-tiles', 'tiles');
    map.createLayer('Tile Layer 1', tileset!, 0, -220)!; // nem me pergunta pq desse -220
    // this.spawnEnemy();

    this.events.on('enemy-killed', (enemy: Enemy) => {
      // Evita que o inimigo seja contabilizado mais de uma vez
      if (enemy.reward === 0) return;
      // se o inimigo não tiver recompensa, quer dizer que ele já foi contabilizado

      this.gold += enemy.extractReward();
      this.HUD.updateGold(this.gold);
    });

    this.events.on('enemy-reached-end', (enemy: Enemy) => {
      this.health -= enemy.damage;
      this.HUD.updateHealthBar(this.health);

      if (this.health <= 0) this.scene.start('GameOverScene');
    });

    // ╭──────────────────────────────────────────────────────────╮
    // │                          debug                           │
    // ╰──────────────────────────────────────────────────────────╯
    this.enemies.push(new Enemy(this, enemy1));
  }

  spawnEnemy() {
    const baseDelay = 1000;
    const variableDelay = 8000;

    this.time.delayedCall(baseDelay + Math.random() * variableDelay, () => {
      this.enemies.push(
        new Enemy(this, Phaser.Utils.Array.GetRandom([enemy1, enemy2, enemy3]))
      );
      this.spawnEnemy();
    });
  }

  update() {
    if (this.enemies.length === 30) return;
    for (const enemy of this.enemies) {
      if (enemy.active) enemy.update();
    }
    for (const tower of this.towers) tower.update();
  }

  generatePath(points: any) {
    const path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) path.lineTo(x, y);

    return path;
  }
}

export default GameScene;
