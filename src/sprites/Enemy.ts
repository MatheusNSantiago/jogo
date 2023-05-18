import GameScene from '../scenes/GameScene';
import { makeAnimation } from '../utils';
import Barrier from './Barrier';
import HealthBar from './HealthBar';

export interface EnemyConfig {
  texture: string;
  velocity: number;
  hp: number;
  reward: number;
  damage: number;
}

export default class Enemy extends Phaser.GameObjects.Sprite {
  declare scene: GameScene;
  declare state: 'walking' | 'attacking' | 'dying' | 'dead';

  textureID: string;
  path: Phaser.Curves.Path;

  velocity: number;
  hp: HealthBar;
  reward: number;
  damage: number;

  follower: Phaser.GameObjects.PathFollower;
  target?: Barrier;

  constructor(scene: GameScene, config: EnemyConfig) {
    super(scene, 0, 0, config.texture);
    this.textureID = config.texture;
    this.velocity = config.velocity;
    this.hp = new HealthBar(scene, config.hp);
    this.reward = config.reward;
    this.damage = config.damage;

    this.path = this.generatePath();

    // create follower
    this.follower = scene.add
      .follower(
        this.path,
        this.path.startPoint.x,
        this.path.startPoint.y,
        this.textureID
      )
      .setScale(0.5);

    this.follower.startFollow({
      duration: (this.path.getLength() / this.velocity) * 1000,
      repeat: 0,
    });

    this.walk();
  }

  hurt(damage: number) {
    this.hp.decrease(damage);

    if (this.hp.value == 0) this.die();
  }

  extractReward() {
    const reward = this.reward;
    this.reward = 0;

    return reward;
  }

  isDead() {
    return this.state === 'dead' || this.state === 'dying';
  }

  update() {
    const pathCompleted = this.path
      .getEndPoint()
      .equals(this.follower.pathVector);

    const isAlreadyAttacking = this.state === 'attacking';
    if (!isAlreadyAttacking && this.scene.barrier?.isCollidingWithEnemy(this)) {
      this.target = this.scene.barrier;
      this.attack();
    }

    this.hp.draw(this.x, this.y);
    if (pathCompleted) {
      this.scene.events.emit('enemy-reached-end', this);
      return this.dispose();
    }

    this.setPosition(this.follower.x, this.follower.y);
  }

  walk() {
    if (this.state == 'walking') return;
    this.follower.resumeFollow();
    const animation = makeAnimation(
      this.scene,
      'Walking',
      this.textureID,
      true
    );
    this.follower.anims.play(animation);
    this.state = 'walking';
  }

  attack() {
    if (this.target === undefined) return;

    // Começar animação de ataque
    if (this.state !== 'attacking') {
      const animation = makeAnimation(
        this.scene,
        'Attacking',
        this.textureID,
        true
      );
      this.follower.anims.play(animation);
      this.follower.pauseFollow();
      this.state = 'attacking';
    }

    this.target.hurt(this.damage);

    if (this.target.hp.isZero()) {
      this.target = undefined;

      this.walk();
    }

    this.scene.time.addEvent({
      delay: 1000,
      callback: this.attack,
      callbackScope: this,
    });
  }

  die() {
    if (this.state == 'dying') return;
    const animation = makeAnimation(this.scene, 'Dying', this.textureID);
    this.follower.anims.play(animation);
    this.state = 'dying';

    this.follower.pauseFollow();
    this.follower.on('animationcomplete', () => {
      this.state = 'dead';
      this.dispose();
    });
  }

  dispose() {
    this.setActive(false);
    this.follower.destroy();
    this.hp.destroy();
    this.destroy();
  }

  generatePath() {
    var noise = Phaser.Math.Between(-30, 30);
    var points = this.scene.path.getPoints(1);

    for (const point of points) {
      point.x += noise;
      point.y += noise;
    }

    const path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) path.lineTo(x, y);

    return path;
  }
}