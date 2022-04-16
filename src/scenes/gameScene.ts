import { Planet } from "./game/planet";
import { Meteor } from "./game/meteor";
import { Shield } from "./game/shield";
import { EVENTS, STAT_CHANGE, eventsManager } from "../eventsManager";
import { FxManager } from "../fxManager";
import { GameOverScene } from "./gameOverScene";
import { TutorialStep, UiScene } from "./uiScene";
import { EIGHTBIT_WONDER } from "../fonts";

const METEOR_SPAWN_DELAY_AT_START = 3000; // ms.
const METEOR_SPAWN_DELAY_MINIMUM = 250; // ms.
const METEOR_SPAWN_ACCELERATION = 50; // ms. after each meteor creation

export class GameScene extends Phaser.Scene {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  planet!: Planet;
  meteors!: Phaser.GameObjects.Group;
  shield!: Shield;

  bigMeteor: Phaser.GameObjects.Sprite | null = null;

  #startDelay = 3;
  #meteorDelay = METEOR_SPAWN_DELAY_AT_START;
  #nextMeteorAt!: number;

  meteorMaximum = 12;
  peopleInEscapePod = 100;

  peopleSaved = 0;

  #podsEscaped = 0;
  #podsDestroyed = 0;
  #meteorHits = 0;

  #noticeText!: Phaser.GameObjects.Text;

  #fxManager!: FxManager;
  #meteorAnimation!: Phaser.Animations.Animation;
  #music!: Phaser.Sound.BaseSound;

  #started = false;
  #gameWasQuit = false;

  constructor() {
    super({ key: "GameScene" });
  }

  preload() {
    this.load.audio("gameplaymusic", [
      "assets/music/gameplay.mp3",
      "assets/music/gameplay.ogg",
    ]);

    this.load.image("planet", "assets/images/planet.png");
    this.load.image("meteor", "assets/images/meteor.png");
    this.load.spritesheet("animatedmeteor", "assets/images/meteorAnim.png", {
      frameWidth: 32,
      frameHeight: 32,
    });

    // this.load.image("shield", "assets/images/shield2.png");
    this.load.spritesheet("shield", "assets/images/shieldframes.png", {
      frameWidth: 8,
      frameHeight: 48,
    });

    this.load.spritesheet("smoke", "assets/images/smoke.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.spritesheet("stars", "assets/images/star.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
    this.load.image("rocket", "assets/images/rocket.png");
    this.load.image("flame", "assets/images/flame.png");

    this.load.audio("sfx_asteroid_create", [
      "assets/sfx/asteroid_create.mp3",
      "assets/sfx/asteroid_create.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_planet", [
      "assets/sfx/asteroid_hit_planet.mp3",
      "assets/sfx/asteroid_hit_planet.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_shield_1", [
      "assets/sfx/asteroid_hit_shield_1.mp3",
      "assets/sfx/asteroid_hit_shield_1.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_shield_2", [
      "assets/sfx/asteroid_hit_shield_2.mp3",
      "assets/sfx/asteroid_hit_shield_2.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_shield_3", [
      "assets/sfx/asteroid_hit_shield_3.mp3",
      "assets/sfx/asteroid_hit_shield_3.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_shield_4", [
      "assets/sfx/asteroid_hit_shield_4.mp3",
      "assets/sfx/asteroid_hit_shield_4.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_shield_5", [
      "assets/sfx/asteroid_hit_shield_5.mp3",
      "assets/sfx/asteroid_hit_shield_5.ogg",
    ]);
    this.load.audio("sfx_asteroid_hit_shield_6", [
      "assets/sfx/asteroid_hit_shield_6.mp3",
      "assets/sfx/asteroid_hit_shield_6.ogg",
    ]);
    this.load.audio("sfx_rocket_hit_shield", [
      "assets/sfx/rocket_hit_shield.mp3",
      "assets/sfx/rocket_hit_shield.ogg",
    ]);
    this.load.audio("sfx_rocket_launch", [
      "assets/sfx/rocket_launch.mp3",
      "assets/sfx/rocket_launch.ogg",
    ]);
    this.load.audio("sfx_shield_rotate", [
      "assets/sfx/shield_rotate.mp3",
      "assets/sfx/shield_rotate.ogg",
    ]);
  }

  create() {
    this.cursors = this.input.keyboard.createCursorKeys();

    this.planet = new Planet(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );
    this.shield = new Shield(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2,
      this.planet
    );

    this.meteors = new Phaser.GameObjects.Group(this);
    this.meteors.maxSize = this.meteorMaximum;
    this.#noticeText = this.add.text(this.cameras.main.width / 2, 100, "");
    this.#noticeText.setFontFamily(EIGHTBIT_WONDER);
    this.#noticeText.setFontSize(40);
    this.#noticeText.setColor("#eedd00");
    this.#noticeText.setOrigin(0.5, 0.5);

    eventsManager.addSingletonListener(EVENTS.SHIELD_SEGMENT_DESTROYED, this.start);

    eventsManager.addSingletonListener(EVENTS.POD_ESCAPED, () => {
      this.peopleSaved += this.peopleInEscapePod;
      this.#podsEscaped++;
      eventsManager.emit(EVENTS.UPDATE_SCORE, this.peopleSaved);
      eventsManager.emit(
        EVENTS.UPDATE_STATS,
        STAT_CHANGE.PodEscaped,
        this.#podsEscaped
      );
    });
    eventsManager.addSingletonListener(EVENTS.POD_DESTROYED, () => {
      this.#podsDestroyed++;
      eventsManager.emit(
        EVENTS.UPDATE_STATS,
        STAT_CHANGE.PodDestroyed,
        this.#podsDestroyed
      );
    });
    eventsManager.addSingletonListener(EVENTS.METEOR_HITS_GROUND, () => {
      this.#meteorHits++;
      eventsManager.emit(
        EVENTS.UPDATE_STATS,
        STAT_CHANGE.MeteorHitGround,
        this.#meteorHits
      );
    });
    eventsManager.addSingletonListener(EVENTS.PAUSE_GAME, () => {
      if (this.scene.isPaused()) {
        this.scene.resume();
      } else {
        this.scene.pause();
      }
    });
    this.#fxManager = new FxManager(this);
    this.#music = this.game.sound.get("gameplaymusic");
    if (!this.#music) {
      this.#music = this.game.sound.add("gameplaymusic", {
        loop: true,
        volume: 0.5,
      });
    }
    this.#music.play();

    const quitKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q);
    quitKey.removeListener("down");
    quitKey.on("down", () => {
      console.log('Quit key pressed');
      this.goToGameOver();
    });

    const muteKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.M);
    muteKey.removeListener("down");
    muteKey.on("down", () => {
      this.sound.mute = !this.sound.mute;
      eventsManager.emit(EVENTS.TOGGLE_MUTE);
    });

    this.#meteorAnimation = this.anims.create({
      key: "meteorspin",
      frames: "animatedmeteor",
      frameRate: 9,
      repeat: -1,
    }) as Phaser.Animations.Animation;

    this.#nextMeteorAt = this.game.getTime() + this.#meteorDelay;
  }

  start = () => {
    if (this.#started || this.#gameWasQuit) return;
    this.#started = true;

    this.#noticeText.text = "PREPARE FOR\nDESTRUCTION";
    this.#noticeText.alpha = 0;

    eventsManager.emit(
      EVENTS.TUTORIAL_ADVANCE,
      TutorialStep.PREPARE_FOR_DESTRUCTION
    );

    const timeline = this.tweens.createTimeline({
      onComplete: () => (this.#noticeText.text = ""),
    });

    timeline.add({
      targets: [this.#noticeText],
      alpha: 1,
      duration: 100,
    });
    timeline.add({
      targets: [this.#noticeText],
      repeat: 2,
      yoyo: true,
      duration: 300,
      alpha: 0.5,
    });
    timeline.add({
      targets: [this.#noticeText],
      alpha: 0,
      duration: 300,
      onComplete: () => {},
    });

    timeline.play();

    this.planet.start();
  };

  createMeteor(planetCenter: Phaser.Math.Vector2) {
    const position = Phaser.Math.RotateTo(
      new Phaser.Math.Vector2(),
      planetCenter.x,
      planetCenter.y,
      Phaser.Math.Angle.Random(),
      750
    );
    const newMeteor = new Meteor(this, position.x, position.y);
    this.meteors.add(newMeteor);
    newMeteor.play(this.#meteorAnimation);
    return newMeteor;
  }

  update(time: number, delta: number) {
    delta /= 1000;

    this.planet.update(delta);
    this.shield.update(delta);

    if (this.bigMeteor) {
      this.bigMeteor.update(delta);
    }

    this.meteors.getChildren().forEach((meteor) => {
      meteor.update(this.planet.getCenter(), time, delta);
    });

    if (this.#startDelay > 0) {
      this.#startDelay -= delta;
      if (this.#startDelay > 0) {
        return;
      }
      eventsManager.emit(EVENTS.TUTORIAL_ADVANCE, TutorialStep.FIRST_METEOR);
    }

    if (!this.#started && this.meteors.getLength() === 0) {
      const newMeteor = new Meteor(this, 150, 0, 3);
      const angleToPlanet = Phaser.Math.Angle.BetweenPoints(
        newMeteor.getCenter(),
        this.planet.getCenter()
      );
      newMeteor.angle = Phaser.Math.RadToDeg(angleToPlanet);
      newMeteor.thrust(0.02);
      this.meteors.add(newMeteor);
      return;
    }

    if (this.#started && time > this.#nextMeteorAt) {
      if (this.#meteorDelay > METEOR_SPAWN_DELAY_MINIMUM) {
        this.#meteorDelay -= METEOR_SPAWN_ACCELERATION;
      }
      this.#nextMeteorAt = time + this.#meteorDelay;
      if (!this.meteors.isFull()) {
        this.createMeteor(this.planet.getCenter());
      }
    }

    if (this.planet.isCompletelyOnFire || this.shield.isCompletelyGone) {
      this.goToGameOver();
    }
  }

  goToGameOver() {
    console.log("Game was quit...");
    this.#gameWasQuit = true;
    this.#music.stop();
    this.scene.start("GameOverScene", { podsEscaped: this.#podsEscaped });
  }
}
