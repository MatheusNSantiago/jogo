export default class Enemy extends Phaser.GameObjects.Sprite {
  public velocity: number;
  private path: Phaser.Curves.Path;
  private pathGraphic: Phaser.GameObjects.Graphics;
  private locText!: Phaser.GameObjects.Text;
  private follower: Phaser.GameObjects.PathFollower;

  constructor(scene: Phaser.Scene, velocity = 180) {
    super(scene, 0, 0, 'enemy');
    this.velocity = velocity;

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
        'Walking/Walking_000.png'
      )
      .setScale(0.5).setZ(-1)

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
    if (pathCompleted) {
      this.follower.destroy();
      this.pathGraphic.destroy();
      this.destroy(true);
      return;
    }

    var { x, y } = this.follower;
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
