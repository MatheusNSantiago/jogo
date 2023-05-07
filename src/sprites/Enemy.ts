interface EnemyConfig {
  velocity: number;
  hp: number;
  reward: number;
}
export default class Enemy extends Phaser.GameObjects.Sprite {
  public velocity: number;
  public hp: HealthBar;
  public reward: number;

  public path: Phaser.Curves.Path;
  private pathGraphic!: Phaser.GameObjects.Graphics;
  private follower: Phaser.GameObjects.PathFollower;

  constructor(scene: Phaser.Scene, { velocity, hp, reward }: EnemyConfig) {
    super(scene, 0, 0, "enemy");
    this.velocity = velocity;
    this.hp = new HealthBar(scene, this, hp);
    this.reward = reward;

    this.path = this.generatePath();

    // create follower
    this.follower = scene.add
      .follower(
        this.path,
        this.path.startPoint.x,
        this.path.startPoint.y,
        "enemy",
        "Walking/Walking_000.png"
      )
      .setScale(0.5);

    this.animateFollower();
  }

  hurt(damage: number) {
    this.hp.decrease(damage);

    if (this.isDead()) this.dispose()
  }

  dispose() {
    this.setActive(false);
    this.follower.destroy();
    this.pathGraphic.destroy();
    this.hp.destroy();
    this.destroy()
  }

  extractReward() {
    const reward = this.reward;
    this.reward = 0;

    return reward;
  }

  isDead() {
    return this.hp.value == 0;
  }

  generatePath() {
    var noise = Phaser.Math.Between(-30, 30);
    var points = [
      { x: -50, y: 640 },
      { x: 650, y: 640 },
      { x: 650, y: 1380 },
      { x: 1400, y: 1380 },
      { x: 1400, y: 150 },
      { x: 2400, y: 150 },
      { x: 2400, y: 1125 },
      { x: 2870, y: 1125 },
    ];

    for (const point of points) {
      point.x += noise;
      point.y += noise;
    }

    const path = new Phaser.Curves.Path(points[0].x, points[0].y);

    for (var { x, y } of points.slice(1)) {
      path.lineTo(x, y);
    }

    // (DEBUG) draw path
    this.pathGraphic = this.scene.add.graphics({
      lineStyle: {
        width: 2,
        color: Phaser.Display.Color.RandomRGB(0, 200).color,
      },
    });
    path.draw(this.pathGraphic);

    return path;
  }

  animateFollower() {
    const animationExist = this.scene.anims.exists("walk");

    if (!animationExist) {
      // cria a animação
      const frameNames = this.anims.generateFrameNames("enemy", {
        start: 0,
        end: 17,
        zeroPad: 3,
        prefix: "Walking/Walking_",
        suffix: ".png",
      });
      this.scene.anims.create({
        key: "walk",
        frames: frameNames,
        frameRate: 25,
        repeat: -1,
      });
    }

    this.follower.anims.play("walk");
    this.follower.startFollow({
      duration: (this.path.getLength() / this.velocity) * 1000,
      repeat: 0,
    });
  }

  update() {
    const pathCompleted = this.path
      .getEndPoint()
      .equals(this.follower.pathVector);

    this.hp.draw();
    if (pathCompleted) {
      this.dispose();
      return;
    }

    this.setPosition(this.follower.x, this.follower.y);
  }
}

class HealthBar extends Phaser.GameObjects.Graphics {
  enemy: Enemy;
  total: number;
  value: number;
  p: number;

  constructor(scene: Phaser.Scene, enemy: Enemy, total: number) {
    super(scene);
    this.enemy = enemy;
    this.setDepth(1);

    this.total = total;
    this.value = total;
    this.p = 76 / total;

    this.draw();
    scene.add.existing(this);
  }

  decrease(amount: number) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();
  }

  draw() {
    this.clear();

    const x = this.enemy.x - 30;
    const y = this.enemy.y - 80;

    //  BG
    this.fillStyle(0x000000);
    this.fillRect(x, y, 80, 16);

    //  Health
    this.fillStyle(0xffffff);
    this.fillRect(x + 2, y + 2, 76, 12);

    if (this.value < this.total * 0.3) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.fillRect(x + 2, y + 2, d, 12);
  }
}
