import GameScene from "../scenes/GameScene";
import { useAnimation } from "../utils";
import Enemy from "./Enemy";

class Bomb extends Phaser.GameObjects.Arc {
  declare scene: GameScene;
  damage: number;
  radius: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    radius = 400,
    damage = 100
  ) {
    super(scene, x, y, radius, 0, 360, false, 0xff0000, 0.3);

    this.setDepth(2);
    this.damage = damage;
    this.radius = radius;

    scene.add.existing(this);
  }

  dispose() {
    this.destroy();
  }

  explode() {
    const enemyMargin = 100;
    const bombBounds = new Phaser.Geom.Circle(
      this.x,
      this.y,
      this.radius - enemyMargin
    );

    // Da dano em todos os inimigos que estiverem dentro do raio
    for (const enemy of this.scene.enemies) {
      const isInRange = Phaser.Geom.Intersects.CircleToRectangle(
        bombBounds,
        enemy.getBounds()
      );

      if (isInRange && enemy.active) {
        enemy.hurt(this.damage);
      }
    }

    this.playExplosionAnimation();
    this.playExplosionSound();

    this.scene.time.delayedCall(300, () => this.dispose());
  }

  playExplosionAnimation() { }

  playExplosionSound() { }

  static dragAndDrop(scene: GameScene, button: Phaser.GameObjects.Image) {
    var bomb: Bomb;

    button.on("dragstart", ({ x, y }: Phaser.Input.Pointer) => {
      bomb = new this(scene, x, y).setInteractive({ cursor: "pointer" });
      scene.input.setDraggable(bomb);
    })
    button.on("drag", ({ x, y }: Phaser.Input.Pointer) => {
      scene.input.setDefaultCursor("grabbing");
      bomb.setPosition(x, y);
    });
    button.on("dragend", () => {
      scene.input.setDefaultCursor("default");
      bomb.explode();
    });
  }
}

export default Bomb;
