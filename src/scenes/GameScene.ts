import {
  PATH_LEVEL_1,
  skeleton1,
  skeleton2,
  skeleton3,
  ork1,
  golem,
  ork3,
} from "../constants";
import Barrier from "../sprites/Barrier";
import Enemy from "../sprites/Enemy";
import Tower from "../sprites/Tower";
import Hud from "./components/Hud";

class GameScene extends Phaser.Scene {
  public enemies!: Enemy[];
  public towers!: Tower[];
  public barrier?: Barrier;
  public path: Phaser.Curves.Path;

  public health!: number;
  public gold!: number;
  public energy!: number;
  private HUD!: Hud;

  constructor() {
    super({ key: "GameScene" });
    this.path = this.generatePath(PATH_LEVEL_1);
  }
  init() {
    this.enemies = [];
    this.towers = [];
    this.energy = 20;
    this.gold = 100;
    this.health = 60;
    this.HUD = new Hud(this);
  }

  create() {
    const map = this.make.tilemap({ key: "level1" });
    const tileset = map.addTilesetImage("ground-tiles", "tiles");
    map.createLayer("Tile Layer 1", tileset!, 0, -220)!; // nem me pergunta pq desse -220

    this.events.on("enemy-killed", (enemy: Enemy) => {
      // Evita que o inimigo seja contabilizado mais de uma vez
      // se o inimigo não tiver recompensa, quer dizer que ele já foi contabilizado
      if (enemy.reward === 0) return;

      this.gold += enemy.extractReward();
      this.HUD.updateGold(this.gold);
    });

    this.events.on("enemy-reached-end", (enemy: Enemy) => {
      this.health -= enemy.damage;
      this.HUD.updateHealthBar(this.health);

      if (this.health <= 0) this.scene.start("GameOverScene");
    });

    this.spawnEnemy(); // Começa a spawnar inimigos
    // ╭──────────────────────────────────────────────────────────╮
    // │                          debug                           │
    // ╰──────────────────────────────────────────────────────────╯
    this.health = 99999;
    this.gold = 9999;
    // this.barrier = new Barrier(this, 400, 700, 10000)
    // this.barrier.enable();
    // this.enemies.push(new Enemy(this, golem));
    // this.enemies.push(new Enemy(this, ork1));
  }

  spawnEnemy() {
    const baseDelay = 1000;
    const variableDelay = 8000;

    this.time.delayedCall(baseDelay + Math.random() * variableDelay, () => {
      this.enemies.push(
        new Enemy(
          this,
          Phaser.Utils.Array.GetRandom([
            skeleton1,
            skeleton2,
            skeleton3,
            ork1,
            ork3,
            golem,
          ])
        )
      );
      this.spawnEnemy();
    });
  }

  subtractGold(amount: number) {
    this.gold -= amount;
    this.HUD.updateGold(this.gold);
  }

  subtractEnergy(amount: number) {
    this.energy -= amount;
    this.HUD.updateEnergy(this.energy);
  }

  update() {
    if (this.enemies.length === 30) return;
    for (const enemy of this.enemies) if (enemy.active) enemy.update();
    for (const tower of this.towers) tower.update();
  }

  isMouseOnTopOfPath(x: number, y: number, distance = 85.0) {
    const point = this.path.getPoints();
    return point.some(
      (p) => Phaser.Math.Distance.Between(x, y, p.x, p.y) < distance
    );
  }

  generatePath(points: any) {
    const path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) path.lineTo(x, y);

    return path;
  }
}

export default GameScene;
