import { Planet } from "./game/planet";
import { Meteor } from "./game/meteor";
import { Ship } from "./game/ship";
import { Shield } from "./game/shield";
import { BigMeteor } from "./game/bigMeteor";
import { EVENTS, eventsManager } from "../eventsManager";
import { FxManager } from "../fxManager";

export class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  player!: Phaser.Physics.Matter.Sprite;
  obstacle!: Phaser.Physics.Matter.Sprite;
  planet!: Planet
  meteors!: Phaser.GameObjects.Group
  shield!: Shield

  bigMeteor: Phaser.GameObjects.Sprite | null = null

  meteorMaximum = 10;
  secondsGate = 3;
  peopleInEscapePod = 100

  peopleToSave = 7000000000
  peopleSaved = 0

  toDispose = new Set<{dispose(): void}>()
  #noticeText!: Phaser.GameObjects.Text;

  #fxManager!: FxManager;

  constructor() {
    super({ active: false, visible: false });
    Phaser.Scene.call(this, { key: "GameScene" });
    console.log("game", this.game);
  }

  preload() {
    console.log("Game preload");

    this.load.audio("gameplaymusic", ["assets/music/gameplay.mp3", "assets/music/gameplay.ogg"]);

    this.load.image("planet", "assets/images/planet.png");
    this.load.image("meteor", "assets/images/meteor.png");
    // this.load.image("shield", "assets/images/shield2.png");
    this.load.spritesheet("shield", "assets/images/shieldframes.png", {
      frameWidth: 8,
      frameHeight: 48
    })
    this.load.image("rocket", "assets/images/rocket.png");
    this.load.image("flame", "assets/images/flame.png");

    this.load.image("box", "assets/images/box.png");
    this.load.image("box2", "assets/images/box2.png");
  }

  create() {
    console.log("Game create");
    this.cursors = this.input.keyboard.createCursorKeys();

    this.planet = new Planet(this, this.cameras.main.width / 2, this.cameras.main.height / 2)
    this.shield = new Shield(this, this.cameras.main.width / 2, this.cameras.main.height / 2, this.planet, this.start)

    this.meteors = new Phaser.GameObjects.Group(this)
    this.meteors.maxSize = this.meteorMaximum
    this.#noticeText = this.add.text(this.cameras.main.width / 2, 100, "")
    this.#noticeText.setFontFamily("sans-serif")
    this.#noticeText.setFontSize(40)
    this.#noticeText.setColor("#eedd00")
    this.#noticeText.setOrigin(0.5, 0.5)

    eventsManager.on(EVENTS.POD_ESCAPED, () => {
      this.peopleSaved += this.peopleInEscapePod
      eventsManager.emit(EVENTS.UPDATE_SCORE, this.peopleSaved)
    })

    this.#fxManager = new FxManager(this)
    var music = this.game.sound.add("gameplaymusic", {
      loop: true,
      volume: 0.5
    })
    //music.play();
  }

  #started = false
  start = () => {
    if (this.#started) return
    this.#started = true

    

    this.#noticeText.text = "PREPARE FOR DESTRUCTION"
    this.#noticeText.alpha = 0

    const timeline = this.tweens.createTimeline({
      onComplete: () => this.#noticeText.text = ""
    })

    timeline.add({
      targets: [this.#noticeText],
      alpha: 1,
      duration: 100,
    })
    timeline.add({
      targets: [this.#noticeText],
      repeat: 2,
      yoyo: true,
      duration: 300,
      alpha: 0.5,
    })
    timeline.add({
      targets: [this.#noticeText],
      alpha: 0,
      duration: 300,
    })
    timeline.play()

    this.planet.start()
  }

  createMeteor(planetCenter: Phaser.Math.Vector2) {
    const position = Phaser.Math.RotateTo(new Phaser.Math.Vector2(), planetCenter.x, planetCenter.y, Phaser.Math.Angle.Random(), 750)
    const newMeteor = new Meteor(this, position.x, position.y)
    this.meteors.add(newMeteor)
    return newMeteor
  }

  update(time: number, delta: number) {
    delta /= 1000

    this.planet.update(delta)
    this.shield.update(delta)

    if (this.bigMeteor) {
      this.bigMeteor.update(delta)
    }

    this.meteors.getChildren().forEach(
      (meteor) => { meteor.update(this.planet.getCenter(), time, delta) }
    )

    if (!this.#started && this.meteors.getLength() === 0) {
      const newMeteor = new Meteor(this, 150, 0)
      const angleToPlanet = Phaser.Math.Angle.BetweenPoints(newMeteor.getCenter(), this.planet.getCenter())
      newMeteor.angle = Phaser.Math.RadToDeg(angleToPlanet)
      newMeteor.thrust(0.02)
      this.meteors.add(newMeteor)
      return
    } 

    if (this.#started && ((time / 1000) | 0) % this.secondsGate === 0) {
      this.secondsGate += 1
      if (!this.meteors.isFull()) {
        this.createMeteor(this.planet.getCenter())
      }
    }

    if (this.planet.isCompletelyOnFire || this.shield.isCompletelyGone) {
      // TODO END GAME!
    }

  }
}
