class LevelCompleteScene extends Phaser.Scene {
  constructor() {
    super({ key: "LevelCompleteScene" });
  }

  create() {
    const cx = this.cameras.main.centerX;

    this.text("VOCÊ CONSEGUIU, PARABÉNS!!", cx, 150, {
      fontSize: 80,
      color: "#0f0",
      origin: 0.5,
    });

    this.playerScore(850, 283);

    this.leaderboard(1650, 350);

    this.scoreForm(920, 720);

    this.button("Recomeçar", cx, 1200, () => this.scene.start("GameScene"), {
      fontSize: 80,
      padding: 35,
    });
  }

  leaderboard(x: number, y: number) {
    const height = 580;

    this.div(x, y - 67, 600, 65); // header
    this.div(x, y, 600, height); // main
    this.div(x, y, 80, height); // numeração

    this.text("Leaderboard", x + 107, y - 30, { fontSize: 50 });

    for (let i = 1; i <= 10; i++) {
      if (i < 10) {
        this.text(i.toString(), x + 27, y - 10 + i * 55);
        this.text(`nickname ${i}`, x + 107, y - 10 + i * 55);
      } else {
        this.text(i.toString(), x + 15, y - 10 + i * 55);
        this.text(`nickname ${i}`, x + 107, y - 10 + i * 55);
      }
    }
    this.div(x + 480, y, 120, height); // pontuação
    for (let i = 1; i <= 10; i++) {
      this.text((Math.random() * 220).toFixed(0), x + 500, y - 10 + i * 55);
    }
  }

  playerScore(x: number, y: number) {
    const vida = 80;
    const gold = 50;
    const torres = 8;
    const score = vida + gold - torres;
    const divWidth = 600;
    const divX = x - 40;
    const leftTextX = x;
    const rightTextX = x + 450;

    this.div(divX, y, divWidth, 60);
    this.text("Seu Score", x, y + 30, { fontSize: 50 });

    this.div(divX, y + 62, divWidth, 220);

    this.text("Vida:", leftTextX, y + 120);
    this.text(vida.toString(), rightTextX, y + 120);

    this.text("Gold:", leftTextX, y + 175);
    this.text(gold.toString(), rightTextX, y + 175);

    this.text("Torres:", leftTextX, y + 230);
    this.text(torres.toString(), rightTextX, y + 230);

    this.div(divX, y + 285, divWidth, 60);

    this.text(`Total: (${vida}+${gold}-${torres})`, leftTextX, y + 317);
    this.text(score.toString(), rightTextX, y + 317);
  }

  scoreForm(x: number, y: number) {
    this.text("Participar da classificação", x - 110, y);
    this.text("Nickname:", x - 110, y + 80);

    const nicknameInput = this.add.dom(
      x + 300,
      y + 80,
      "input",
      "background-color: white; width: 300px; height: 50px; font: 48px Arial"
    );

    this.button("Enviar", x, y + 180, () => {
      console.log("Nickname: ", (nicknameInput.node as any)["value"]);
    });
  }

  button(
    text: string,
    x: number,
    y: number,
    callback: Function,
    opts?: {
      fontSize?: number;
      padding?: number;
    }
  ) {
    let button = this.add.text(x, y, text, {
      fontSize: `${opts?.fontSize ?? 50}px`,
      color: "#FFF",
    });

    button
      .setOrigin(0.5)
      .setPadding(opts?.padding ?? 20)
      .setStyle({ backgroundColor: "#111" })
      .setInteractive({ useHandCursor: true })
      .on("pointerdown", () => callback())
      .on("pointerover", () => button.setStyle({ fill: "#f39c12" }))
      .on("pointerout", () => button.setStyle({ fill: "#FFF" }));
  }

  text(
    text: string,
    x: number,
    y: number,
    opts?: {
      fontSize?: number;
      origin?: number;
      color?: string;
    }
  ) {
    return this.add
      .text(x, y, text, {
        fontSize: opts?.fontSize ?? 40,
        color: opts?.color ?? "#FFF",
      })
      .setOrigin(opts?.origin ?? 0.0, 0.5);
  }

  div(x: number, y: number, width: number, height: number) {
    return this.add
      .dom(
        x,
        y,
        "div",
        `border: 2px solid white; width: ${width}px; height: ${height}px; z-index: -1`
      )
      .setOrigin(0.0);
  }
}

export default LevelCompleteScene;
