import GameScene from "../scenes/GameScene";
import { useAnimation } from "../utils";
import Barrier from "./Barrier";
import HealthBar from "./HealthBar";

export interface EnemyConfig {
  texture: string;
  velocity: number;
  hp: number;
  reward: number;
  damage: number;
  attackSpeed: number;
  scale?: number;
  frameRate?: number;
  pathNoise?: {
    dx: { lower: number; upper: number };
    dy: { lower: number; upper: number };
  };
}

export default class Enemy extends Phaser.GameObjects.Sprite {
  declare scene: GameScene;
  declare state: "walking" | "attacking" | "dying" | "dead";

  textureID: string;
  path: Phaser.Curves.Path;

  hp: HealthBar;
  config: EnemyConfig;
  velocity: number;
  reward: number;
  damage: number;
  attackSpeed: number;

  follower: Phaser.GameObjects.PathFollower;
  target?: Barrier;

  constructor(scene: GameScene, config: EnemyConfig) {
    super(scene, 0, 0, config.texture);
    this.config = config;
    this.textureID = config.texture;
    this.velocity = config.velocity;
    this.hp = new HealthBar(scene, config.hp).setVisible(false);
    this.reward = config.reward;
    this.damage = config.damage;
    this.attackSpeed = config.attackSpeed;

    this.path = this.generatePath();

    // create follower
    this.follower = scene.add
      .follower(
        this.path,
        this.path.startPoint.x,
        this.path.startPoint.y,
        this.textureID
      )
      .setScale(config.scale)
      // Os que foram criados primeiro ficam na frente
      .setDepth(this.scene.maxQuantityOfEnemies - this.scene.enemies.length);

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
    return this.state === "dead" || this.state === "dying" || !this.active;
  }

  update() {
    const isPathCompleted = this.path
      .getEndPoint()
      .equals(this.follower.pathVector);

    const enconteredABarrier = this.scene.barrier?.isCollidingWithEnemy(this);
    if (enconteredABarrier && this.state !== "attacking") {
      this.target = this.scene.barrier;
      this.attack();
    }

    // Se ele levar dano, mostra o hp
    const hasTakenDamage = this.hp.value < this.hp.total;
    if (hasTakenDamage && !this.hp.visible) this.hp.setVisible(true);

    this.hp.draw(this.x, this.y);
    if (isPathCompleted) {
      this.scene.events.emit("enemy-reached-end", this);
      return this.dispose();
    }

    this.setPosition(this.follower.x, this.follower.y);
    this.follower.setPosition(this.follower.x, this.follower.y);
  }

  walk() {
    if (this.state == "walking") return;
    this.follower.resumeFollow();
    const animation = useAnimation(this.scene, "Walking", this.textureID, {
      frameRate: this.config.frameRate,
    });
    this.follower.anims.play(animation);
    this.state = "walking";
  }

  attack() {
    if (this.target === undefined || this.isDead()) return;

    // Começar animação de ataque
    if (this.state !== "attacking") {
      const animation = useAnimation(this.scene, "Attacking", this.textureID, {
        frameRate: (this.config.frameRate ?? 18) * this.attackSpeed,
      });
      this.follower.play(animation);
      this.follower.pauseFollow();
      this.state = "attacking";

      // At every frame of the animation, set the position to
      // this.follower.on('animationupdate', () => {
      // });
    }

    if (this.target.hp.isZero()) {
      this.target = undefined;
      this.walk();
    }

    this.scene.time.addEvent({
      delay: (700 * 1) / this.attackSpeed,
      callback: () => {
        this.target?.hurt(this.damage);
        this.attack();
      },
      callbackScope: this,
    });
  }

  die() {
    if (this.state == "dying") return;
    const animation = useAnimation(this.scene, "Dying", this.textureID, {
      loop: false,
      frameRate: this.config.frameRate,
    });
    this.follower.anims.play(animation);
    this.state = "dying";

    this.follower.pauseFollow();
    this.follower.on("animationcomplete", () => {
      this.state = "dead";
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
    const { dx, dy } = this.config.pathNoise ?? {
      dx: { lower: 0, upper: 0 },
      dy: { lower: 0, upper: 0 },
    };

    var points = this.scene.path.getPoints(1);
    for (const point of points) {
      point.x += Phaser.Math.Between(dx.lower, dx.upper);
      point.y += Phaser.Math.Between(dy.lower, dy.upper);
    }

    const path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) path.lineTo(x, y);

    return path;
  }

  getBounds<O extends Phaser.Geom.Rectangle>(): O {
    return this.follower.getBounds();
  }
}
