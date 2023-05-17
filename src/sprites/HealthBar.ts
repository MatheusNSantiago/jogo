import Enemy from './Enemy';

export default class HealthBar extends Phaser.GameObjects.Graphics {
  total: number;
  value: number;
  p: number;

  constructor(scene: Phaser.Scene, total: number) {
    super(scene);
    this.setDepth(1);

    this.total = total;
    this.value = total;
    this.p = 76 / total;

    scene.add.existing(this);
  }

  decrease(amount: number) {
    this.value -= amount;

    if (this.value < 0) this.value = 0;
  }

  draw(x: number, y: number) {
    this.clear();

    var x = x - 30;
    var y = y - 80;

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
