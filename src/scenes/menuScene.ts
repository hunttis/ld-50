import { GameScene } from "./gameScene";
import { EIGHTBIT_WONDER } from "../fonts";

export class MenuScene extends Phaser.Scene {
  StartGameEvent: string = "StartGameEvent";
  #music: any
  padding = 50;

  constructor() {
    super({ key: "MenuScene", active: false, visible: false });
  }

  preload() {
    console.log("Menu preload");
    // this.scene.add("GameScene", GameScene, false);
    
    this.load.audio("mainmenumusic", ["assets/music/mainmenu.mp3", "assets/music/mainmenu.ogg"]);
    this.load.image("menubackground", "assets/images/menubackground.png");
  }

  create() {
    console.log("Menu create");

    this.add.image(640, 360, "menubackground");

    this.createGameTitle();
    this.createControlInstructions();
    this.createStartInstructions();

    this.events.on(this.StartGameEvent, this.startGameScene, this);

    var mainMenuKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    mainMenuKey.on('down', () => {
      this.events.emit(this.StartGameEvent);
    });

    this.#music = this.game.sound.add("mainmenumusic", {
      loop: true,
      volume: 0.5
    })
    this.#music.play();
  }

  createGameTitle() {
    const screenCenterX = this.cameras.default.width / 2;

    this.add.text(screenCenterX, 100, "AND THEN THERE WERE NONE", {
      // backgroundColor: "rgba(0, 0, 0, .5)",
      fontFamily: EIGHTBIT_WONDER,
      fontSize: "64px",
      // padding: { x: 30, y: 10 },
    })
    .setOrigin(.5, .5)
    .setStroke("#077", 10)
    .setShadow(3, 3, "#000", 5, true, true)
  }

  createControlInstructions() {
    const textX = this.cameras.default.width * .75;
    const textStartY = 350
    const instructionsTextSize = 20
    const rowHeight = instructionsTextSize + 25
    const textStyle = { fontFamily: EIGHTBIT_WONDER, fontSize: `${instructionsTextSize}px` }

    this.add.text(textX + 50, textStartY, "Controls", {
      fontSize: `${instructionsTextSize * 1.2}px`
    }).setOrigin(0, .5)

    this.add.text(textX - 50, textStartY + rowHeight, "Rotate shields: ⬅ / ⮕", textStyle).setOrigin(0, .5)
    this.add.text(textX - 50, textStartY + rowHeight * 2, "Launch escape pods: ⬆", textStyle).setOrigin(0, .5)
    this.add.text(textX - 50, textStartY + rowHeight * 3, "Pause game: P", textStyle).setOrigin(0, .5)
    this.add.text(textX - 50, textStartY + rowHeight * 4, "Music/sounds: M", textStyle).setOrigin(0, .5)
  }

  createStartInstructions() {
    const instructions = this.add.text(1280, 710, "Press SPACE to start ", {
      fontFamily: EIGHTBIT_WONDER,
      fontSize: "32px",
      stroke: "#000",
      strokeThickness: 4,
    }).setOrigin(1, 1)

    this.tweens.add({
      targets: instructions,
      alpha: .25,
      duration: 750,
      yoyo: true,
      loop: -1
    });
  }

  update() {
    // Menuscene update loop
  }

  startGameScene() {
    this.#music.stop();
    this.scene.start("UiScene");
    this.scene.start("GameScene");
  }
}
