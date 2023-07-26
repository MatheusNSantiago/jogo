import { API } from "../api";
import { globalEvents } from "../utils";

class LevelCompleteScene extends Phaser.Scene {
  private torresUsadas!: number;
  private hp!: number;
  private gold!: number;
  private rankings!: any[];
  private _leaderboard!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: "LevelCompleteScene" });

    globalEvents.on("level-complete", ({ torresUsadas, hp, gold }: any) => {
      this.torresUsadas = torresUsadas;
      this.hp = hp;
      this.gold = gold;
    });
  }

  async create() {
    const cx = this.cameras.main.centerX;

    this.text("VOCÊ CONSEGUIU, PARABÉNS!!", cx, 150, {
      fontSize: 80,
      color: "#0f0",
      origin: 0.5,
    });

    this.playerScore(850, 283);
    this.scoreForm(920, 720);

    this.button("Recomeçar", cx, 1200, () => this.scene.start("GameScene"), {
      fontSize: 80,
      padding: 35,
    });

    this._leaderboard = await this.leaderboard(1650, 350);
  }

  async leaderboard(x: number, y: number, ranking?: any[]) {
    const height = 580;

    const group = this.add.group([
      this.div(x, y - 67, 600, 65), // header
      this.div(x, y, 600, height), // main
      this.div(x, y, 80, height), // numeração
      this.div(x + 480, y, 120, height), // pontuação

      this.text("Leaderboard", x + 107, y - 30, { fontSize: 50 }),
    ]);

    if (!ranking) this.rankings = await API.getRankings();

    for (let i = 1; i <= this.rankings.length; i++) {
      let { nickname, score } = this.rankings[i - 1];

      group.addMultiple([
        this.text(i.toString(), x + (i < 10 ? 27 : 15), y - 10 + i * 55),
        this.text(nickname, x + 107, y - 10 + i * 55),
        this.text(score, x + 500, y - 10 + i * 55),
      ]);
    }

    return group;
  }

  playerScore(x: number, y: number) {
    const score = this.hp + this.gold - this.torresUsadas;
    const divWidth = 600;
    const divX = x - 40;
    const leftTextX = x;
    const rightTextX = x + 450;

    this.div(divX, y, divWidth, 60);
    this.text("Seu Score", x, y + 30, { fontSize: 50 });

    this.div(divX, y + 62, divWidth, 220);

    this.text("Vida:", leftTextX, y + 120);
    this.text(this.hp.toString(), rightTextX, y + 120);

    this.text("Gold:", leftTextX, y + 175);
    this.text(this.gold.toString(), rightTextX, y + 175);

    this.text("Torres:", leftTextX, y + 230);
    this.text(this.torresUsadas.toString(), rightTextX, y + 230);

    this.div(divX, y + 285, divWidth, 60);

    this.text(
      `Total: (${this.hp}+${this.gold}-${this.torresUsadas})`,
      leftTextX,
      y + 317
    );
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

    this.button("Enviar", x, y + 180, async () => {
      let nickname = (nicknameInput.node as any)["value"];

      const score = this.hp + this.gold - this.torresUsadas;

      this.rankings.push({ nickname, score });
      this.rankings.sort((a, b) => b.score - a.score);

      this._leaderboard.destroy(true);
      this.rankings = this.rankings.slice(0, 10);
      this._leaderboard = await this.leaderboard(1650, 350, this.rankings)

      if (nickname.length > 0) {
        await API.postRanking({
          nickname: nickname.slice(0, 13),
          torresUsadas: this.torresUsadas,
          gold: this.gold,
          hp: this.hp,
        });
      }
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
