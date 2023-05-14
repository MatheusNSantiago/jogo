import Tower from '../sprites/Tower';
import Enemy from '../sprites/enemy';
import Hud from './components/Hud';

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

    this.events.on('enemy-killed', (enemy: Enemy) => {
      // Evita que o inimigo seja contabilizado mais de uma vez
      // se o inimigo não tiver recompensa, quer dizer que ele já foi contabilizado
      if (enemy.reward === 0) return;

      this.gold += enemy.extractReward();
      this.HUD.updateGold(this.gold);
    });

    this.events.on('enemy-reached-end', (enemy: Enemy) => {
      this.health -= enemy.damage;
      this.HUD.updateHealthBar(this.health);
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
          damage: 20,
        })
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
}

export default GameScene;
