import GameScene from '../scenes/GameScene';
import { isMouseOnTopOfPath } from '../utils';
import Enemy from './Enemy';

export interface TowerConfig {
  type: 'archer' | 'castle' | 'knight-post';
  range: number;
  damage: number;
  cost: number;
}

export default class Tower extends Phaser.GameObjects.Image {
  declare scene: GameScene;
  missile: Phaser.GameObjects.Arc;
  radius: number;
  radiusArc: Phaser.GameObjects.Arc;
  damage = 20;
  cost: number;

  enemies: Enemy[];
  target?: Enemy;

  constructor(
    scene: GameScene,
    x: number,
    y: number,
    { type, range, damage, cost }: TowerConfig
  ) {
    super(scene, x, y, 'towers', `${type}-tower-front.png`);
    this.radius = range;
    this.enemies = scene.enemies;
    this.damage = damage;
    this.cost = cost;
    this.setActive(false);

    this.scene.add.existing(this);

    this.missile = this.scene.add
      .circle(0, 0, 10, 0x0000ff, 1)
      .setVisible(false);

    this.radiusArc = this.scene.add
      .circle(this.x, this.y, this.radius, 0x1a73e8, 0.3)
      .setDepth(99);

    this.on('pointerover', () => this.radiusArc.setVisible(true));
    this.on('pointerout', () => this.radiusArc.setVisible(false));
  }

  enable() {
    this.setActive(true);
    this.radiusArc.setVisible(false);
    this.input!.cursor = 'pointer';
  }

  update() {
    if (!this.active) {
      return this.radiusArc.setPosition(this.x, this.y);
    }

    const needsToFindNewTarget =
      this.target === undefined || this.target.isDead();
    if (needsToFindNewTarget) {
      for (const enemy of this.enemies) {
        if (!enemy.isDead() && this.isTargetInRange(enemy)) {
          this.target = enemy;
          this.scene.time.addEvent({
            delay: 1000,
            callback: this.fire,
            callbackScope: this,
          });
          return;
        }
      }
    } else {
      if (!this.isTargetInRange(this.target!)) {
        this.target = undefined;
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
    if (this.target && !this.target.isDead()) {
      this.missile.setPosition(this.x, this.y).setVisible(true);

      this.scene.tweens.add({
        targets: this.missile,
        x: this.target.x,
        y: this.target.y,
        ease: 'Linear',
        duration: 300,
        onComplete: () => {
          this.target?.hurt(this.damage);
          this.missile.setVisible(false);
          if (this.target?.isDead()) {
            this.scene.events.emit('enemy-killed', this.target);
            this.target = undefined;
          }
        },
      });

      this.scene.time.addEvent({
        delay: 1500, //,Phaser.Math.Between(1000, 3000),
        callback: this.fire,
        callbackScope: this,
      });
    }
  }

  dispose() {
    this.destroy();
    this.radiusArc.destroy();
  }

  static dragAndDrop(
    scene: GameScene,
    button: Phaser.GameObjects.Image,
    towerConfig: TowerConfig
  ) {
    var tower: Tower;
    button.on('dragstart', ({ x, y }: Phaser.Input.Pointer) => {
      tower = new Tower(scene, x, y, towerConfig);
      tower.setInteractive({ cursor: 'grabbing' });
      scene.input.setDraggable(tower);
    });
    button.on('drag', ({ x, y }: Phaser.Input.Pointer) => {
      if (isMouseOnTopOfPath(scene.path, x, y)) {
        scene.input.setDefaultCursor('not-allowed');
      } else {
        scene.input.setDefaultCursor('grabbing');
      }

      tower.setPosition(x, y);
      tower.update();
    });
    button.on('dragend', ({ x, y }: Phaser.Input.Pointer) => {
      scene.input.setDefaultCursor('default');

      if (isMouseOnTopOfPath(scene.path, x, y)) {
        tower.dispose();
      } else {
        if (scene.gold >= tower.cost) {
          tower.enable();
          scene.towers.push(tower);
          scene.subtractGold(tower.cost);
        } else {
          tower.dispose();
        }
      }
    });
  }
}
