import GameScene from "../scenes/GameScene";
import Enemy from "./Enemy";
import TowerUpgrade from "./gui/TowerUpgrade";

export interface TowerConfig {
  type: "archer" | "castle" | "knight-post";
  range: number;
  damage: number;
  cost: number;
}

export default class Tower extends Phaser.GameObjects.Image {
  declare scene: GameScene;
  missile: Phaser.GameObjects.Arc;
  radiusArc: Phaser.GameObjects.Arc;
  radius: number;
  damage = 20;
  cost: number;

  target?: Enemy;

  constructor(scene: GameScene, x: number, y: number, config: TowerConfig) {
    super(scene, x, y, "towers", `${config.type}-tower-front.png`);
    this.radius = config.range;
    this.damage = config.damage;
    this.cost = config.cost;
    this.scene.add.existing(this);
    this.setActive(false);

    this.missile = this.scene.add
      .circle(0, 0, 10, 0x0000ff, 1)
      .setVisible(false);

    this.radiusArc = this.scene.add
      .circle(this.x, this.y, this.radius, 0x1a73e8, 0.3)
      .setDepth(99);

    this.on("pointerover", () => this.radiusArc.setVisible(true));
    this.on("pointerout", () => this.radiusArc.setVisible(false));
  }

  enable() {
    this.setActive(true);
    this.radiusArc.setVisible(false);
    this.input!.cursor = "pointer";
  }

  update() {
    if (!this.active) {
      this.radiusArc.setPosition(this.x, this.y);
      return;
    }

    const needsToFindNewTarget =
      this.target === undefined || this.target.isDead();
    if (needsToFindNewTarget) {
      for (const enemy of this.scene.enemies) {
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

  ultimoTiro: number = 0;

  fire() {
    var time = this.scene.time.now;
    if (time - this.ultimoTiro > 1500) {
      this.ultimoTiro = time;

      if (this.target && !this.target.isDead()) {
        this.missile.setPosition(this.x, this.y).setVisible(true);

        this.scene.tweens.add({
          targets: this.missile,
          x: this.target.x,
          y: this.target.y,
          ease: "Linear",
          duration: 300,
          onComplete: () => {
            this.missile.setVisible(false);
            if (this.target == undefined) return;
            this.target.hurt(this.damage);
            if (this.target.isDead()) {
              this.scene.events.emit("enemy-killed", this.target);
              this.target = undefined;
            }
          },
        });
      }
    }

    this.scene.time.addEvent({
      delay: 1000, //,Phaser.Math.Between(1000, 3000),
      callback: this.fire,
      callbackScope: this,
    });
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

    button
      .on("dragstart", ({ x, y }: Phaser.Input.Pointer) => {
        tower = new Tower(scene, x, y, towerConfig);
        tower.setInteractive({ cursor: "grabbing" });
        scene.input.setDraggable(tower);
      })
      .on("drag", ({ x, y }: Phaser.Input.Pointer) => {
        if (scene.isMouseOnTopOfPath(x, y) || scene.isMouseOnTopOfTower(x, y)) {
          scene.input.setDefaultCursor("not-allowed");
        } else {
          scene.input.setDefaultCursor("grabbing");
        }

        tower.setPosition(x, y);
        tower.update();
      })
      .on("dragend", ({ x, y }: Phaser.Input.Pointer) => {
        scene.input.setDefaultCursor("default");

        if (
          scene.isMouseOnTopOfPath(x, y) ||
          scene.isMouseOnTopOfTower(x, y) ||
          scene.gold < tower.cost
        )
          return tower.dispose();

        tower.enable();
        scene.towers.push(tower);
        scene.subtractGold(tower.cost);
      });
  }
}
