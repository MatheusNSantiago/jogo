export default class Enemy extends Phaser.GameObjects.Sprite {
  public velocity: number;
  // public hp: HealthBar;
  private path: Phaser.Curves.Path;
  private pathGraphic: Phaser.GameObjects.Graphics;
  private locText!: Phaser.GameObjects.Text;
  private follower: Phaser.GameObjects.PathFollower;


  constructor(scene: Phaser.Scene, velocity = 180) {
    super(scene, 0, 0, 'enemy');
    this.velocity = velocity;
    // this.hp = new HealthBar(scene, this);

    const points = this.generatePath();

    // cria o path
    this.path = new Phaser.Curves.Path(points[0].x, points[0].y);
    for (const { x, y } of points.slice(1)) this.path.lineTo(x, y);

    this.pathGraphic = this.scene.add.graphics({
      lineStyle: {
        width: 2,
        color: Phaser.Display.Color.RandomRGB(0, 200).color,
      },
    });
    this.path.draw(this.pathGraphic);

    this.follower = scene.add
      .follower(
        this.path,
        points[0].x,
        points[0].y,
        'enemy',
        'Walking/Walking_000.png',
      )
      .setScale(0.5)

    this.animateFollower();
  }

  generatePath() {
    var noise = Phaser.Math.Between(-30, 30);
    const points = [
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

    return points;
  }

  animateFollower() {
    const animationExist = this.scene.anims.exists('walk');

    if (!animationExist) {
      // cria a animação
      const frameNames = this.anims.generateFrameNames('enemy', {
        start: 0,
        end: 17,
        zeroPad: 3,
        prefix: 'Walking/Walking_',
        suffix: '.png',
      });
      this.scene.anims.create({
        key: 'walk',
        frames: frameNames,
        frameRate: 25,
        repeat: -1,
      });
    }

    this.follower.anims.play('walk');
    this.follower.startFollow({
      duration: (this.path.getLength() / this.velocity) * 1000,
      repeat: 0,
    });
  }

  update() {
    const pathCompleted = this.path
      .getEndPoint()
      .equals(this.follower.pathVector);

    this.locText?.destroy();
    // this.hp.draw()
    if (pathCompleted) {
      this.follower.destroy();
      this.pathGraphic.destroy();
      this.destroy(true);
      return;
    }

    var { x, y } = this.follower;
    this.setPosition(x , y)

    this.locText = this.scene.add.text(
      x - 50,
      y - 100,
      `Pos: (${Math.round(x)}, ${Math.round(y)})\nVel: ${this.velocity}`,
      {
        color: 'white',
        fontSize: '24px',
        fontFamily: 'Arial',
        backgroundColor: 'black',
      }
    );
  }
}

class HealthBar extends Phaser.GameObjects.Graphics{
  enemy: Enemy;
  value: number;
  p: number;

  constructor(scene: Phaser.Scene, enemy: Enemy) {
    super(scene)
    this.enemy = enemy;

    this.value = 100;
    this.p = 76 / 100;

    this.draw();
    scene.add.existing(this);
  }

  decrease(amount: number) {
    this.value -= amount;

    if (this.value < 0) {
      this.value = 0;
    }

    this.draw();

    return this.value === 0;
  }

  draw() {
    this.setPosition(this.enemy.x - 400, this.enemy.y - 600 )
    this.clear();

    //  BG
    this.fillStyle(0x000000);
    this.fillRect(this.x, this.y, 80, 16);

    //  Health
    this.fillStyle(0xffffff);
    this.fillRect(this.x + 2, this.y + 2, 76, 12);

    if (this.value < 30) {
      this.fillStyle(0xff0000);
    } else {
      this.fillStyle(0x00ff00);
    }

    var d = Math.floor(this.p * this.value);

    this.fillRect(this.x + 2, this.y + 2, d, 12);
  }
}
