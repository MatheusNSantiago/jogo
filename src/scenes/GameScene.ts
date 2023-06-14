import {
  PATH_LEVEL_1,
  skeleton1,
  skeleton2,
  skeleton3,
  ork1,
  golem,
  ork3,
  ARCHER_TOWER,
} from '../constants';
import Barrier from '../sprites/Barrier';
import Enemy from '../sprites/Enemy';
import Tower from '../sprites/Tower';
import Hud from '../sprites/gui/Hud';

class GameScene extends Phaser.Scene {
  public enemies!: Enemy[];
  public towers!: Tower[];
  public barrier?: Barrier;
  public path: Phaser.Curves.Path;
  public maxQuantityOfEnemies = 30;

  public health!: number;
  public gold!: number;
  public energy!: number;
  private HUD!: Hud;
  private waves!: any[]

  constructor() {
    super({ key: 'GameScene' });
    this.path = this.generatePath(PATH_LEVEL_1);
  }
  init() {
    this.enemies = [];
    this.towers = [];
    this.energy = 20;
    this.gold = 100;
    this.health = 60;
    this.HUD = new Hud(this);
    this.waves = this.cache.json.get('level1-waves')['wave']
  }

  create() {
    /* cria o mapa */
    const map = this.make.tilemap({ key: 'level1' });
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
    //this.faseAlert("fase1");
    this.time.delayedCall(3000, () => this.spawnEnemy(0)); // Começa a spawnar inimigos
    this.addEnergy(); // Começa a acrescentar energia

    // ╭──────────────────────────────────────────────────────────╮
    // │                          debug                           │
    // ╰──────────────────────────────────────────────────────────╯
    // this.health = 99999;
    // this.gold = 9999;
    // this.energy = 9999;
    // this.barrier = new Barrier(this, 400, 700, 10000)
    // this.barrier.enable();
    // this.enemies.push(new Enemy(this, golem));
    // this.enemies.push(new Enemy(this, ork1));
  }

  spawnEnemy(waveNumber: number) {
    if(this.waves.length > waveNumber){
      this.faseAlert('wave ' + (waveNumber+1))
      this.foo(waveNumber);
    }else {
      return this.scene.start('LevelCompleteScene');
    }
    
  }

  foo(waveNumber: number) {
    console.log(this.waves[waveNumber].length);
    var cd_base = 1000;

    if (this.waves[waveNumber].length !== 0) {
      const { enemy, cd } = this.waves[waveNumber].shift();
      cd_base = cd;
      this.choseEnemy(enemy);
    }
    
    const naoTemInimigoVivo = this.enemies.every((enemy) => enemy.isDead());
    if (naoTemInimigoVivo) {
      //return this.scene.start('LevelCompleteScene');
      return this.time.delayedCall(1000,() => {
        this.spawnEnemy(waveNumber+1)
      });
    }

    this.time.delayedCall(cd_base, () => this.foo(waveNumber));
  }

  choseEnemy(enemy: string) {
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
      color: 'green'
    });
    textoFase.setOrigin(0.5);

    // Defina um temporizador para remover o texto após alguns segundos
    this.time.delayedCall(3000,() => {
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

  private generatePath(points: any) {
    const path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) path.lineTo(x, y);

    return path;
  }
}

export default GameScene;
