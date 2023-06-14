import GameScene from '../../scenes/GameScene';

class TowerUpgrade extends Phaser.GameObjects.Container {
  declare scene: GameScene;
  upgradePopup: Phaser.GameObjects.Image;
  optionTopLeft: Phaser.GameObjects.Container;
  optionTopRight: Phaser.GameObjects.Container;
  optionBottomLeft: Phaser.GameObjects.Container;
  optionBottomRight: Phaser.GameObjects.Container;

  constructor(scene: GameScene) {
    super(scene);

    this.upgradePopup = scene.add
      .image(this.x, this.y, 'tower-upgrade')
      .setDepth(1000)
      .setScale(2.3)
      .setVisible(false);

    this.optionTopLeft = this.addOption('X2 \ndano', 100);
    this.optionTopRight = this.addOption('X1.5 \nalcance', 100);
    this.optionBottomLeft = this.addOption('X2 \ndano', 100);
    this.optionBottomRight = this.addOption('X2 \ndano', 100);

    // Se o usuário clicar fora do popup, esconda o popup
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (!this.upgradePopup.getBounds().contains(pointer.x, pointer.y)) {
        this.setVisible(false);
      }
    });
  }

  setVisible(value: boolean): this {
    this.upgradePopup.setVisible(value);
    this.optionTopLeft.setVisible(value);
    this.optionTopRight.setVisible(value);
    this.optionBottomLeft.setVisible(value);
    this.optionBottomRight.setVisible(value);
    return this;
  }

  mover(x: number, y: number) {
    this.upgradePopup.setPosition(x, y);
    this.optionTopLeft.setPosition(x - 178, y - 122);
    this.optionTopRight.setPosition(x + 168, y - 122);
    this.optionBottomLeft.setPosition(x - 173, y + 154);
    this.optionBottomRight.setPosition(x + 168, y + 154);
  }

  dispose() {
    this.upgradePopup.destroy();
    this.optionTopLeft.destroy();
    this.optionTopRight.destroy();
    this.optionBottomLeft.destroy();
    this.optionBottomRight.destroy();
    this.destroy();
  }

  private addOption(description: string, cost: number) {
    const box = this.scene.add.rectangle(0, 0, 154, 152).setVisible(false);
    const boxBounds = box.getBounds();

    const descriptionText = this.scene.add.text(0, 0, description, {
      fontFamily: 'Arial',
      color: '#fff',
      fontSize: 33.5,
      align: 'center',
      stroke: '#000000',
      strokeThickness: 4,
    });
    descriptionText.setPosition(
      boxBounds.centerX - descriptionText.width / 2,
      boxBounds.centerY - descriptionText.height / 1.35
    );

    const costText = this.scene.add.text(0, 0, cost.toString(), {
      fontFamily: 'Arial',
      fontSize: 30,
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4,
    });
    costText.setPosition(
      boxBounds.centerX - costText.width / 2,
      boxBounds.bottom - costText.height - 2.5
    );

    return this.scene.add
      .container(this.x, this.y, [box, descriptionText, costText])
      .setDepth(1001)
      .setVisible(false)
      .setSize(box.width, box.height)
      .setInteractive({cursor: 'pointer'})
      .on('pointerdown', () => {
      });
  }
}
export default TowerUpgrade;
