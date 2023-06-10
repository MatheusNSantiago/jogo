import GameScene from "../scenes/GameScene";
import Enemy from "./Enemy";
import HealthBar from "./HealthBar";

class Barrier extends Phaser.GameObjects.Rectangle {
  declare scene: GameScene;
  hp: HealthBar;
  isHpVisible = false;

  constructor(scene: GameScene, x: number, y: number, hp = 100) {
    super(scene, x, y, 200, 30, 0x663300);
    this.setDepth(2);
    this.setActive(false);
    this.hp = new HealthBar(scene, hp);
    this.hp.setVisible(false);

    scene.add.existing(this);
  }

  update() {
    this.hp.draw(this.x, this.y + 20);

    // Se algum inimigo danificar a barreira, mostra o hp
    if (!this.isHpVisible) {
      const hasTakenDamage = this.hp.value < this.hp.total;
      if (hasTakenDamage) {
        this.isHpVisible = true;
        this.hp.setVisible(true);
      }
    }
  }

  enable() {
    this.setActive(true);
  }

  hurt(damage: number) {
    this.hp.decrease(damage);
    this.update();
    if (this.hp.value == 0) this.dispose();
  }

  isCollidingWithEnemy(enemy: Enemy) {
    if (!this.active || !enemy.active) return false;

    return Phaser.Geom.Intersects.RectangleToRectangle(
      enemy.getBounds(),
      this.getBounds()
    );
  }

  dispose() {
    this.hp.destroy();
    this.destroy();
  }

  static dragAndDrop(scene: GameScene, button: Phaser.GameObjects.Image) {
    var barrier: Barrier;

    button.on("dragstart", ({ x, y }: Phaser.Input.Pointer) => {
      barrier = new Barrier(scene, x, y).setInteractive({ cursor: "pointer" });
      scene.input.setDraggable(barrier);
    });
    button.on("drag", ({ x, y }: Phaser.Input.Pointer) => {
      if (scene.isMouseOnTopOfPath(x, y)) {
        scene.input.setDefaultCursor("grabbing");
      } else {
        scene.input.setDefaultCursor("not-allowed");
      }
      barrier.setPosition(x, y);
    });
    button.on("dragend", () => {
      if (!scene.isMouseOnTopOfPath(barrier.x, barrier.y))
        return barrier.dispose();

      scene.input.setDefaultCursor("default");
      barrier.enable();
      scene.barrier = barrier;
    });
  }
}

export default Barrier;
