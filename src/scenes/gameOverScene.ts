import { EIGHTBIT_WONDER } from "../fonts";

interface GameData {
    podsEscaped: number
}

export class GameOverScene extends Phaser.Scene {
  commonFontStyle = {
    fontFamily: EIGHTBIT_WONDER,
    fontSize: "24px",
    //fill: "#77dd77",
    fill: "#ddeedd",
    align: "center"
  }
  headerStyle = {
    ...this.commonFontStyle,
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
    super({ key: "GameOverScene", active: false, visible: false })
    this.podsEscaped = 0
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
      
    if (peopleSaved > 0) {
      descriptionText +=
      "\n\n"
      + "But thanks to your valiant efforts defending it and\n"
      + "your courageous self-sacrifice, some of the planet's\n"
      + "richest inhabitants with escape pods managed to escape."
    }
    

    const scoreText = (peopleSaved ? peopleSaved : "No") + " people escaped."

    const statisticText = "(That's "
      + (peopleSaved / 7_000_000_000).toFixed(10)
      + "% of the planet's population.)"

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
    
    this.#music = this.game.sound.add("gameovermusic", {
      loop: true,
      volume: 0.5
    })
    this.#music.play();

    var mainMenuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    mainMenuKey.on('down', () => {
      this.#music.stop();
      this.scene.start("MenuScene")
    });


  }
}
