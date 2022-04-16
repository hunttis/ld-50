import { EIGHTBIT_WONDER, VCR_OSD_MONO } from "../fonts";
import { EVENTS, eventsManager } from "../eventsManager";

interface GameData {
    podsEscaped: number
}

export class GameOverScene extends Phaser.Scene {
  commonFontStyle = {
    fontFamily: VCR_OSD_MONO,
    fontSize: "24px",
    fill: "#ddeedd",
    align: "center",
    stroke: "#000",
    strokeThickness: 4,
  }
  headerStyle = {
    ...this.commonFontStyle,
    fontFamily: EIGHTBIT_WONDER,
    fontSize: "64px",
    fill: "#00dd99"
  }
  scoreStyle = {
    ...this.commonFontStyle,
    fontSize: "32px"
  }
  
  statisticsStyle = {
    ...this.commonFontStyle,
    fontSize: "20px"
  }
  
  #music!: Phaser.Sound.BaseSound

  podsEscaped: number

  constructor(peopleSaved: number) {
    super({ key: "GameOverScene" });
    this.podsEscaped = 0;
  }

  init(data: GameData) {
    this.podsEscaped = data.podsEscaped
  }

  preload() {
    this.load.audio("gameovermusic", ["assets/music/gameover.mp3", "assets/music/gameover.ogg"]);
    this.load.image("gameoverbackground", "assets/images/gameoverbackground.png");
  }

  create() {
    this.add.image(640, 360, "gameoverbackground");

    const peopleSaved = this.podsEscaped * 100

    const headerText = "🎖 Game over 🎖"

    let descriptionText =
      "The planet was destroyed."
    
    let adjective1 = "no thanks to your poopy"
    let adjective2 = "inept"
    let adjective3 = "pitiful few"

    if (peopleSaved >= 1000) {
      adjective1 = "thanks to your good"
      adjective2 = "brave"
      adjective3 = "some"
    }
    
    if (peopleSaved >= 1500) {
      adjective1 = "thanks to your valiant"
      adjective2 = "heroic"
      adjective3 = "almost all"
    }

    if (peopleSaved > 0) {
      descriptionText += 
      `\n\nBut ${adjective1} efforts defending it and\nyour ${adjective2} self-sacrifice, ${adjective3} of the planet's\n richest inhabitants with escape pods managed to escape.`
    }
    

    const scoreText = (peopleSaved || "No") + " people escaped."

    let statisticText = ""
    if (peopleSaved > 0) {
      statisticText = "(That's "
        + (peopleSaved / 7_000_000_000).toFixed(10)
        + "% of the planet's population.)"
    }

    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;
    const screenOneThirdY = this.cameras.main.height / 3;

    this.add.text(
      screenCenterX,
      screenOneThirdY,
      headerText,
      this.headerStyle
    ).setOrigin(.5, 1);

    this.add.text(
      screenCenterX,
      screenCenterY,
      descriptionText,
      this.commonFontStyle
    ).setOrigin(.5, .5);

    this.add.text(
      screenCenterX,
      screenOneThirdY * 2,
      scoreText,
      this.scoreStyle
    ).setOrigin(.5, 0);

    
    this.add.text(
      screenCenterX,
      screenCenterY * 1.5,
      statisticText,
      this.statisticsStyle
    ).setOrigin(.5, 0);

    
    this.add.text(
      screenCenterX,
      screenCenterY * 1.8,
      "Press SPACE to play again",
      this.statisticsStyle
    ).setOrigin(.5, 0)

    this.#music = this.game.sound.get("gameovermusic");
    if (!this.#music) {
      this.#music = this.game.sound.add("gameovermusic", {
        loop: true,
        volume: 0.5
      })
    }
    this.#music.play();

    const restartKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    restartKey.removeListener("down");
    restartKey.on('down', () => {
      this.#music.stop();
      this.scene.start("GameScene")
      this.scene.start("UiScene")
    });
  }
}
