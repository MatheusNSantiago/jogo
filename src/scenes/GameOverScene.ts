class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  create() {
    const { centerX, centerY } = this.cameras.main;
    this.add
      .text(centerX, centerY - 150, 'VOCÊ FRACASSOU', {
        color: '#0f0',
        fontSize: 80,
      })
      .setOrigin(0.5);

    const startButton = this.add
      .text(centerX, centerY, 'Recomeçar', { fontSize: '52px', color: '#FFF' })
      .setOrigin(0.5)
      .setPadding(20)
      .setStyle({ backgroundColor: '#111' })
      .setInteractive({ useHandCursor: true })
      .on('pointerdown', () => this.scene.start('GameScene'))
      .on('pointerover', () => startButton.setStyle({ fill: '#f39c12' }))
      .on('pointerout', () => startButton.setStyle({ fill: '#FFF' }));
  }
}

export default GameOverScene;
