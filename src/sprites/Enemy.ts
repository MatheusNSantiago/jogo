import GameScene from '../scenes/GameScene';
import { makeAnimation } from '../utils';
import HealthBar from './HealthBar';

export interface EnemyConfig {
  texture: string;
  velocity: number;
  hp: number;
  reward: number;
  damage: number;
}

type EnemyState = 'walking' | 'attacking' | 'dying' | 'dead';

export default class Enemy extends Phaser.GameObjects.Sprite {
  declare scene: GameScene;
  declare state: EnemyState;

  public textureID: string;
  public path: Phaser.Curves.Path;
  // public state: EnemyState;

  public velocity: number;
  public hp: HealthBar;
  public reward: number;
  public damage: number;

  private follower: Phaser.GameObjects.PathFollower;

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

    if (this.isDead()) this.die();
  }

  extractReward() {
    const reward = this.reward;
    this.reward = 0;

    return reward;
  }

  isDead() {
    return this.hp.value == 0;
  }

  graphics = this.scene.add.graphics();

  update() {
    const pathCompleted = this.path
      .getEndPoint()
      .equals(this.follower.pathVector);

    const barrier = this.scene.barrier;

    if (
      barrier &&
      Phaser.Geom.Intersects.RectangleToRectangle(
        this.follower.getBounds(),
        barrier.getBounds()
      )
    ) {
      this.attack();
    }

    // draw enemy bounds
    this.graphics.clear();
    this.graphics.lineStyle(1, 0xffffff, 1);
    this.graphics.strokeRectShape(this.follower.getBounds());

    this.hp.draw(this.x, this.y);
    if (pathCompleted) {
      this.scene.events.emit('enemy-reached-end', this);
      this.dispose();
      return;
    }

    this.setPosition(this.follower.x, this.follower.y);
  }

  walk() {
    if (this.state == 'walking') return;
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
    if (this.state == 'attacking') return;
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
