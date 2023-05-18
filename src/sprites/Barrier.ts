import GameScene from '../scenes/GameScene';
import Enemy from './Enemy';
import HealthBar from './HealthBar';

class Barrier extends Phaser.GameObjects.Rectangle {
  hp: HealthBar;

  constructor(scene: GameScene, x: number, y: number, hp = 50) {
    super(scene, x, y, 200, 30, 0x663300);
    this.setDepth(2);
    this.setActive(false)
    this.hp = new HealthBar(scene, hp);
    this.hp.setVisible(false);

    scene.add.existing(this);
  }

  update() {
    this.hp.draw(this.x, this.y + 20);
  }

  enable() {
    this.setActive(true);
  }

  hurt(damage: number) {
    this.hp.decrease(damage);
    this.update()
    if (this.hp.value == 0) this.dispose();
  }

  isCollidingWithEnemy(enemy: Enemy) {
    if (!this.active) return false;

    const enemyIsNearby = Phaser.Geom.Intersects.RectangleToRectangle(
      enemy.follower.getBounds(),
      this.getBounds()
    );

    if (enemyIsNearby) this.hp.setVisible(true);
    else this.hp.setVisible(false);

    return enemyIsNearby;
  }

  dispose() {
    this.hp.destroy();
    this.destroy();
  }

  static dragAndDrop(scene: GameScene, button: Phaser.GameObjects.Image) {
    var barrier: Barrier;

    button.on('dragstart', ({ x, y }: Phaser.Input.Pointer) => {
      barrier = new Barrier(scene, x, y).setInteractive({cursor: "pointer"});
      scene.input.setDraggable(barrier);
    });
    button.on('drag', ({ x, y }: Phaser.Input.Pointer) => {
      scene.input.setDefaultCursor('grabbing');

      barrier.setPosition(x, y);
      barrier.update();
    });
    button.on('dragend', () => {
      scene.input.setDefaultCursor('default');
      barrier.enable();
      scene.barrier = barrier;
    });
  }
}

export default Barrier;
