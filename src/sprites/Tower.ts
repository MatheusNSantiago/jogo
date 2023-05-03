import Enemy from "./Enemy";

export default class Tower extends Phaser.GameObjects.Sprite {
  timer: Phaser.Time.TimerEvent;
  missile: any;
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

    // this.missile = new Missile(scene, "blue-missile");
    this.missile = this.scene.add.circle(0, 0, 10, 0x0000ff, 1);

    scene.add.image(x, y, "towers", frame);

    this.timer = scene.time.addEvent({
      delay: 1000,
      callback: this.fire,
      callbackScope: this,
    });
  }

  enable() {
    this.disabled = false;
  }

  update() {
    this.target = this.enemies[0];
  }

  fire() {
    if (this.target && !this.disabled) {
      var offset = -20;

      this.scene.add.existing(this.missile);

      this.missile.setPosition(this.x + offset, this.y + 20).setVisible(true);

      this.scene.tweens.add({
        targets: this.missile,
        x: this.target.x,
        y: this.target.y,
        ease: "Linear",
        duration: 500,
        onComplete: function(tween, targets) { },
      });

      this.timer = this.scene.time.addEvent({
        delay: Phaser.Math.Between(1000, 3000),
        callback: this.fire,
        callbackScope: this,
      });
    }
  }
}

