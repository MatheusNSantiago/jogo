class SplashScene extends Phaser.Scene {
  constructor() {
    super({ key: 'SplashScene' });
  }
  preload() {
    this.load.image('logo', 'assets/samuraijs/images/logo.png');
    // this.load.audio("voiceover", "assets/samuraijs/sounds/voiceover.mp3");
    this.load.spritesheet('splashbg', 'assets/samuraijs/stages/haoh.png', {
      frameWidth: 800,
      frameHeight: 600,
    });
    this.load.image('leaf', 'assets/samuraijs/particles/leaf.png');
  }

  create() {
    const background = this.add.sprite(401, 300, 'splashbg').setScale(1.0);
    this.anims.create({
      key: 'bg_anim',
      frames: this.anims.generateFrameNumbers('splashbg', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    // this.add.image(400, 250, 'logo');
    background.anims.play('bg_anim', true);

    this.load.spritesheet('leaf', 'assets/samuraijs/particles/leaf.png', {
      frameWidth: 22,
      frameHeight: 14,
    });

    let pointerX = 400;
    let pointerY = 200;

    this.input.on('pointerdown', (pointer: any) => {
      pointerX = pointer.worldX;
      pointerY = pointer.worldY;
    });

    this.add.particles(0, 0, 'leaf', {
      gravityY: 200,
      x: () => pointerX,
      y: () => pointerY,
      rotate: { min: 90, max: 360 },
      speed: { min: -200, max: 700 },
      angle: { min: 0, max: 180 },
      scale: { min: 0.1, max: 0.5},
      alpha: { min: 1, max: 4 },
      frequency: 2000,
      lifespan: 4000,
      quantity: 50,
      tint: 0xffffff,
    });
    //   .createEmitter({
    //   x: 600,
    //   y: 200,
    //   rotate: { min: 90, max: 360 },
    //   speed: { min: -200, max: 700 },
    //   angle: { min: 0, max: 180 },
    //   scale: { min: 0.01, max: 0.01 },
    //   alpha: { min: 1, max: 4 },
    //   frequency: 2000,
    //   lifespan: 4000,
    //   quantity: 50,
    //   tint: 0xffffff,
    // });

    this.add
      .text(400, 400, 'PRESS ANY BUTTON TO START', {
        fontFamily: 'Arial',
        fontSize: 25,
        color: '#fff',
      })
      .setOrigin(0.5)
      .setStroke('#000000', 5);
    this.input.keyboard?.on(
      'keydown',
      // (_: any) => this.scene.transition({ target: "loadscene", duration: 500 }),
      (_: any) => console.log('Next Stage'),
      this
    );
  }
}

export default SplashScene;
