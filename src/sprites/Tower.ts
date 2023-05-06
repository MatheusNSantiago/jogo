import Enemy from "./Enemy";

export default class Tower extends Phaser.GameObjects.Image {
  missile: Phaser.GameObjects.Arc;
  radius: number;
  radiusArc: Phaser.GameObjects.Arc;
  damage = 20;
  enemies: Enemy[];
  target?: Enemy;

  constructor(
    scene: Phaser.Scene,
    enemies: Enemy[],
    frame: string,
    x: number,
    y: number,
    radius = 500
  ) {
    super(scene, x, y, "towers", frame);
    this.radius = radius;
    this.enemies = enemies;
    this.setActive(false);

    this.scene.add.existing(this);

    this.missile = this.scene.add
      .circle(0, 0, 10, 0x0000ff, 1)
      .setVisible(false);

    this.radiusArc = this.scene.add
      .circle(this.x, this.y, this.radius, 0x1a73e8, 0.3)
      .setDepth(99);
  }

  enable() {
    this.setActive(true);
    this.radiusArc.setVisible(false);
  }

  update() {
    if (!this.active) {
      return this.radiusArc.setPosition(this.x, this.y);
    }

    if (this.target) {
      if (!this.isTargetInRange(this.target)) {
        this.target = undefined;
      }
    } else {
      for (const enemy of this.enemies) {
        if (!enemy.isDead() && this.isTargetInRange(enemy)) {
          this.target = enemy;
          this.scene.time.addEvent({
            delay: 1000,
            callback: this.fire,
            callbackScope: this,
          });
        }
      }
    }
  }

  isTargetInRange(enemy: Enemy): boolean {
    const targetDistance = Phaser.Math.Distance.Between(
      this.x,
      this.y,
      enemy.x,
      enemy.y
    );

    return targetDistance <= this.radius;
  }

  fire() {
    if (this.target && !this.target.isDead()) {
      this.scene.add.existing(this.missile);
      this.missile.setPosition(this.x, this.y).setVisible(true);

      this.scene.tweens.add({
        targets: this.missile,
        x: this.target.x,
        y: this.target.y,
        ease: "Linear",
        duration: 300,
        onComplete: () => {
          this.target?.hurt(this.damage);
          this.missile.setVisible(false);
          if (this.target?.isDead()) {
            this.scene.events.emit("enemy-killed", this.target);

            this.target = undefined;
          }
        },
      });

      this.scene.time.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: this.fire,
        callbackScope: this,
      });
    }
  }
}
