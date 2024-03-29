import {
  skeleton1,
  skeleton2,
  ork1,
  ork2,
  golem,
  ork3,
  PATH_LEVEL_2,
  PATH_LEVEL_1,
} from '../constants';

import Barrier from '../sprites/Barrier';
import Enemy from '../sprites/Enemy';
import Tower from '../sprites/Tower';
import Hud from '../sprites/gui/Hud';
import { globalEvents } from '../utils';

export type GameStateInfo = {
  level: 'level1' | 'level2';
  health: number;
  gold: number;
  energy: number;
  torresUsadas: number;
};

class GameScene extends Phaser.Scene {
  public enemies!: Enemy[];
  public towers!: Tower[];
  public barrier?: Barrier;
  public path!: Phaser.Curves.Path;
  public level!: 'level1' | 'level2';

  public health!: number;
  public gold!: number;
  public energy!: number;
  private HUD!: Hud;
  private waves!: any[];
  private torresUsadasNoNivelAnterior!: number;

  constructor() {
    super('GameScene');
  }

  init({
    level = 'level1',
    health = 100,
    gold = 100,
    energy = 0,
    torresUsadas = 0,
  }: GameStateInfo) {
    this.level = level;
    this.torresUsadasNoNivelAnterior = torresUsadas;

    this.enemies = [];
    this.towers = [];
    this.energy = energy;
    this.gold = gold;
    this.health = health;
    this.HUD = new Hud(this);

    if (level === 'level1') {
      this.path = this.generatePath(PATH_LEVEL_1);
    } else {
      this.path = this.generatePath(PATH_LEVEL_2);
    }
    this.waves = this.cache.json.get(`${level}-waves`)['wave'];
  }

  create() {
    /* cria o mapa */
    const map = this.make.tilemap({ key: this.level });
    const tileset = map.addTilesetImage('ground-tiles', 'tiles');
    map.createLayer('Tile Layer 1', tileset!, 0, -220)!; // nem me pergunta pq desse -220

    /* Adiciona gold ao matar inimigo */
    this.events.on('enemy-killed', (enemy: Enemy) => {
      // Evita que o inimigo seja contabilizado mais de uma vez
      // se o inimigo não tiver recompensa, quer dizer que ele já foi contabilizado
      if (enemy.reward === 0) return;

      this.gold += enemy.extractReward();
      this.HUD.updateGold(this.gold);
    });

    /* Tira a vida do level e da Game over se acabar a vida */
    this.events.on('enemy-reached-end', (enemy: Enemy) => {
      this.health -= enemy.damage;
      this.HUD.updateHealthBar(this.health);

      if (this.health <= 0) this.scene.start('GameOverScene');
    });

    this.faseAlert(this.level === 'level1' ? 'Nível 1' : 'Nível 2 ☠️');
    this.time.delayedCall(4200, () => this.startWave(0)); // Começa a spawnar inimigos
    this.addEnergy(); // Começa a acrescentar energia
  }

  startWave(waveNumber: number) {
    const isLastWave = waveNumber === this.waves.length;
    if (isLastWave) {
      if (this.level === 'level2') {
        globalEvents.emit('level-complete', {
          torresUsadas: this.torresUsadasNoNivelAnterior + this.towers.length,
          hp: this.health,
          gold: this.gold,
        });
        return this.scene.start('LevelCompleteScene');
      } else {
        return this.scene.start('GameScene', {
          level: 'level2',
          health: 100,
          gold: this.gold,
          energy: this.energy,
          torresUsadas: this.towers.length,
        } as GameStateInfo);
      }
    }

    this.faseAlert('Horda ' + (waveNumber + 1));
    this.spawnEnemy(waveNumber);
  }

  spawnEnemy(waveNumber: number, enemyIndex = 0) {
    var cdBase = 1000;

    const wave = this.waves[waveNumber];

    let isNotLastEnemy = enemyIndex < wave.length;
    if (isNotLastEnemy) {
      const enemyInfo = wave[enemyIndex];

      const { enemy, cd } = enemyInfo;

      cdBase = cd;
      this.choseEnemyToSpawn(enemy);
    }

    /* Começa uma wave nova se acabou a wave e tu matou todos */
    const naoTemInimigoVivo = this.enemies.every((e) => e.isDead());
    if (naoTemInimigoVivo && !isNotLastEnemy) {
      return this.time.delayedCall(1000, () => this.startWave(waveNumber + 1));
    }

    /* Chama a função novamente para spawnar o próximo inimigo ou começar uma nova wave */
    this.time.delayedCall(cdBase, () =>
      this.spawnEnemy(waveNumber, enemyIndex + 1)
    );
  }

  choseEnemyToSpawn(enemy: string) {
    switch (enemy) {
      case 'skeleton1':
        this.enemies.push(new Enemy(this, skeleton1));
        break;
      case 'skeleton2':
        this.enemies.push(new Enemy(this, skeleton2));
        break;
      case 'skeleton3':
        this.enemies.push(new Enemy(this, skeleton2));
        break;
      case 'ork1':
        this.enemies.push(new Enemy(this, ork1));
        break;
      case 'ork2':
        this.enemies.push(new Enemy(this, ork2));
        break;
      case 'ork3':
        this.enemies.push(new Enemy(this, ork3));
        break;
      case 'golem':
        this.enemies.push(new Enemy(this, golem));
        break;
      default:
        break;
    }
  }

  faseAlert(text: string) {
    var larguraTela = this.cameras.main.width;
    var alturaTela = this.cameras.main.height;

    // Crie o texto para o alerta de início de fase
    var textoFase = this.add.text(larguraTela / 2, alturaTela / 2, text, {
      fontFamily: 'Arial',
      fontSize: '200px',
      color: 'green',
    });
    textoFase.setOrigin(0.5);

    // Defina um temporizador para remover o texto após alguns segundos
    this.time.delayedCall(3000, () => {
      textoFase.destroy();
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

  addEnergy() {
    const time = 10000;
    this.time.delayedCall(time, () => {
      this.energy += 5;
      this.HUD.updateEnergy(this.energy);
      this.addEnergy();
    });
  }

  update() {
    for (const enemy of this.enemies) if (enemy.active) enemy.update();
    for (const tower of this.towers) tower.update();
  }

  isMouseOnTopOfPath(x: number, y: number, distance = 85.0) {
    const point = this.path.getPoints();
    return point.some(
      (p) => Phaser.Math.Distance.Between(x, y, p.x, p.y) < distance
    );
  }

  isMouseOnTopOfTower(x: number, y: number, radius = 150.0) {
    return this.towers.some(
      (tower) => Phaser.Math.Distance.Between(x, y, tower.x, tower.y) < radius
    );
  }

  private generatePath(points: any) {
    const path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) path.lineTo(x, y);

    return path;
  }
}

export default GameScene;
