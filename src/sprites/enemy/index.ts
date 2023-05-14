import { PATH_LEVEL_1 } from "../../constants";
import { cloneArray } from "../../utils";
import HealthBar from "./HealthBar";

interface EnemyStats {
  velocity: number;
  hp: number;
  reward: number;
  damage: number;
}
export default class Enemy extends Phaser.GameObjects.Sprite {
  public velocity: number;
  public hp: HealthBar;
  public reward: number;
  public damage: number;

  public path: Phaser.Curves.Path;
  private follower: Phaser.GameObjects.PathFollower;

  constructor(scene: Phaser.Scene, { velocity, hp, reward, damage }: EnemyStats) {
    super(scene, 0, 0, "enemy");
    this.velocity = velocity;
    this.hp = new HealthBar(scene, this, hp);
    this.reward = reward;
    this.damage = damage;

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

  die() {
    const animationExist = this.scene.anims.exists("die");

    if (!animationExist) {
      const frameNames = this.anims.generateFrameNames("enemy", {
        start: 0,
        end: 14,
        zeroPad: 3,
        prefix: "Dying/Dying_",
        suffix: ".png",
      });
      this.scene.anims.create({
        key: "die",
        frames: frameNames,
        frameRate: 25,
        repeat: 0,
      });
    }
    this.follower.pauseFollow();

    this.follower.anims.play("die");
    this.follower.on("animationcomplete", () => {
      this.dispose()
    });
  }

  dispose(){
    this.setActive(false);
    this.hp.destroy();
    this.follower.destroy();
    this.destroy();
  }

  generatePath() {
    var noise = Phaser.Math.Between(-30, 30);
    var points = cloneArray(PATH_LEVEL_1)
    for (const point of points) {
      point.x += noise;
      point.y += noise;
    }

    const path = new Phaser.Curves.Path(points[0].x, points[0].y);

    for (const { x, y } of points.slice(1)) {
      path.lineTo(x, y);
    }

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
      this.scene.events.emit("enemy-reached-end", this);
      this.dispose();
      return;
    }

    this.setPosition(this.follower.x, this.follower.y);
  }
}
