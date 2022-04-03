import { GameScene } from "./gameScene";

export class MenuScene extends Phaser.Scene {
  StartGameEvent: string = "StartGameEvent";
  #music: any

  constructor() {
    super({ active: false, visible: false });
    Phaser.Scene.call(this, { key: "MenuScene" });
    console.log("menu", this.game);
  }

  preload() {
    console.log("Menu preload");
    this.scene.add("GameScene", GameScene, false);
    this.load.audio("mainmenumusic", ["assets/music/start_menu.mp3"])
  }

  create() {
    console.log("Menu create");

    this.createGameTitle();
    this.createStartButton();

    this.events.on(this.StartGameEvent, this.startGameScene, this);

    this.input.keyboard.on("keydown", (event: KeyboardEvent) => {
      console.log("key", event.key);
      this.events.emit(this.StartGameEvent);
    });
    this.#music = this.game.sound.add("mainmenumusic", {
      loop: true,
      volume: 0.5
    })
    this.#music.play();
  }

  createGameTitle() {
    const cameraWidth = this.cameras.default.width;

    const text1 = this.add.text(0, 100, "Impending doom!", { font: "64px Arial" });
    text1.setTint(0xff00ff, 0xffff00, 0x0000ff, 0xff0000);
    text1.x = cameraWidth / 2 - text1.width / 2;
  }

  createStartButton() {
    const cameraWidth = this.cameras.default.width;

    const buttonCoords = {
      x: cameraWidth / 2 - 200,
      y: 400,
      width: 400,
      height: 100,
    };

    const buttonZone = this.add
      .zone(
        buttonCoords.x,
        buttonCoords.y,
        buttonCoords.width,
        buttonCoords.height
      )
      .setOrigin(0)
      .setName("StartGameButton")
      .setInteractive();

    const graphics = this.add.graphics();
    graphics.lineStyle(5, 0xff0f00, 1);
    graphics.strokeRoundedRect(
      buttonCoords.x,
      buttonCoords.y,
      buttonCoords.width,
      buttonCoords.height,
      20
    );

    const startText = this.add.text(0, buttonCoords.y, "Start", {
      font: "64px Arial",
    });
    startText.setTint(0x00ffff, 0xffffff, 0x0000ff, 0xff00f0);
    startText.x = cameraWidth / 2 - startText.width / 2;
    startText.y =
      buttonCoords.y + buttonCoords.height / 2 - startText.height / 2;

    this.input.on(
      "gameobjectdown",
      (
        pointer: Phaser.Input.Pointer,
        gameObject: Phaser.GameObjects.GameObject
      ) => {
        if (gameObject.name === buttonZone.name) {
          this.events.emit(this.StartGameEvent);
        }
      }
    );
  }

  update() {
    // Menuscene update loop
  }

  startGameScene() {
    this.#music.stop();
    this.scene.start("GameScene");
  }
}
