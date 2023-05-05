import Enemy from "./Enemy";

export default class Tower extends Phaser.GameObjects.Sprite {
  missile: any;
  radius: number = 500;
  disabled: boolean = false;
  enemies: Enemy[];
  target?: Enemy;

  constructor(
    scene: Phaser.Scene,
    enemies: Enemy[],
    frame: string,
    x: number,
    y: number
  ) {
    super(scene, x, y, "towers", frame);
    this.enemies = enemies;

    this.missile = this.scene.add.circle(0, 0, 10, 0x0000ff, 1);

    scene.add.image(x, y, "towers", frame);

    scene.add.circle(x, y, this.radius, 0x1a73e8, 0.3).setDepth(99);
  }

  enable() {
    this.disabled = false;
  }

  update() {
    if (this.target) {
      if (!this.isTargetInRange(this.target)) {
        this.target = undefined;
      }
    } else {
      for (const enemy of this.enemies) {
        if (this.isTargetInRange(enemy)) {
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
    if (this.target && !this.disabled) {
      var offset = -20;

      this.scene.add.existing(this.missile);

      this.missile.setPosition(this.x + offset, this.y + 20);

      this.scene.tweens.add({
        targets: this.missile,
        x: this.target.x,
        y: this.target.y,
        ease: "Linear",
        duration: 500,
        onComplete: function(tween, targets) { },
      });

      this.scene.time.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: this.fire,
        callbackScope: this,
      });
    }
  }
}
