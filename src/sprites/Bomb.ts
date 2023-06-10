import GameScene from "../scenes/GameScene";
import { useAnimation } from "../utils";

class Bomb extends Phaser.GameObjects.Arc {
  declare scene: GameScene;
  damage: number;
  radius: number;
  cost: number;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    radius = 500,
    damage = 350,
    cost = 20
  ) {
    super(scene, x, y, radius, 0, 360, false, 0xff0000, 0.3);

    this.setDepth(2);
    this.damage = damage;
    this.radius = radius;
    this.cost = cost;

    scene.add.existing(this);
  }

  explode() {
    const enemyMargin = 100;
    const bombBounds = new Phaser.Geom.Circle(
      this.x,
      this.y,
      this.radius - enemyMargin
    );

    const animation = useAnimation(this.scene, "Explosion", "explosion", {
      loop: false,
      frameRate: 15,
    });
    const explosion = this.scene.add.sprite(this.x, this.y, "explosion");
    explosion.setDisplaySize(this.radius * 5, this.radius * 5);
    explosion.anims.play(animation);

    // Espera até a bomba explodir (que é 1/4 da duração da animação)
    this.scene.time.delayedCall(animation.duration / 4, () => {
      this.setVisible(false);

      // Da dano em todos os inimigos que estiverem dentro do raio
      for (const enemy of this.scene.enemies) {
        const isInRange = Phaser.Geom.Intersects.CircleToRectangle(
          bombBounds,
          enemy.getBounds()
        );
        if (isInRange) enemy.hurt(this.damage);
      }
    });
    explosion.on("animationcomplete", () => {
      explosion.destroy();
      this.destroy();
    });
  }

  static dragAndDrop(scene: GameScene, button: Phaser.GameObjects.Image) {
    var bomb: Bomb;

    button.on("dragstart", ({ x, y }: Phaser.Input.Pointer) => {
      bomb = new this(scene, x, y).setInteractive({ cursor: "pointer" });
      scene.input.setDraggable(bomb);
    });
    button.on("drag", ({ x, y }: Phaser.Input.Pointer) => {
      scene.input.setDefaultCursor("grabbing");
      bomb.setPosition(x, y);
    });
    button.on("dragend", () => {
      if (scene.energy < bomb.cost) return bomb.destroy();
      scene.subtractEnergy(bomb.cost);

      scene.input.setDefaultCursor("default");
      bomb.explode();
    });
  }
}

export default Bomb;
