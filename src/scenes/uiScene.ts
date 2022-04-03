import { EVENTS, STAT_CHANGE, eventsManager } from "../eventsManager";
import { EIGHTBIT_WONDER } from "../fonts";

export enum TutorialStep {
  FIRST_METEOR,
  PREPARE_FOR_DESTRUCTION,
  SHIELD_HIT,
  SHIP_CREATED,
  SHIP_DESTROYED,
  SHIP_SAVED,
}

export class UiScene extends Phaser.Scene {
  // scoreLabel!: Phaser.GameObjects.Text;
  podsSavedLabel!: Phaser.GameObjects.Text;
  podsLostLabel!: Phaser.GameObjects.Text;
  meteorHitsLabel!: Phaser.GameObjects.Text;

  systemLabel!: Phaser.GameObjects.Text;
  systemLabelCooldown: number = 2;

  #tutorialStep: number = 0
  #tutorialLabel!: Phaser.GameObjects.Text;
  #tutorialCooldownMax: number = 2
  #tutorialCooldown: number = this.#tutorialCooldownMax
  #muteOn: any;
  #muteOff: any;

  tutorialTexts: string[] = [
    "Whew, what a peaceful morning...",
    "Oh no, what is that?!",
    "Uh oh.. better get all the rich..\nI mean all the people out of here!",
    "Rotate the shield to protect us!\nUse the left/right arrow keys",
    "Press arrow up to launch evacuation ships!",
    "Hey! Don't just smash them against the shield or rocks!\nThat was Steve Jobs frozen head on that ship!",
    "Nice work! 100 people saved on that one!\nOnly around seven billion left!",
    ""
  ]

  #pauseLabel!: Phaser.GameObjects.Text;
  
  constructor() {
    super({ key: "UiScene", active: false });
  }

  preload() {
    this.load.image("muteOn", "assets/images/muteOn.png");
    this.load.image("muteOff", "assets/images/muteOff.png");
  }

  create() {
    console.log("UI create");

    this.createStatsBox()

    this.systemLabel = this.add.text(1280, 700, 'System', {
      fontFamily: EIGHTBIT_WONDER,
      fontSize: "16px",
    })
    this.systemLabel.x -= this.systemLabel.width + 10

    this.#tutorialLabel = this.add.text(
      this.cameras.main.width / 2,
      600,
      this.tutorialTexts[this.#tutorialStep],
      {
        fontFamily: EIGHTBIT_WONDER,
        fontSize: "24px",
      }
    )
    this.#tutorialLabel.x -= this.#tutorialLabel.width / 2

    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.#pauseLabel = this.add.text(screenCenterX, screenCenterY, "GAME PAUSED", {
      backgroundColor: "rgba(0, 0, 0, .85)",
      fontFamily: EIGHTBIT_WONDER,
      fontSize: "128px",
      padding: { x: 20, y: 10 },
    })
    .setOrigin(.5, .5)
    .setStroke("#077", 10)
    .setShadow(3, 3, "#222", 2, true, true)
    .setVisible(false)

    var pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    pauseKey.on('down', () => {
      eventsManager.emit(EVENTS.PAUSE_GAME)
      this.#pauseLabel.setVisible(!this.#pauseLabel.visible)
    });

    this.createMuteIndicator();

    eventsManager.on(EVENTS.TUTORIAL_ADVANCE, this.advanceTutorial, this)
    // eventsManager.on(EVENTS.UPDATE_SCORE, this.updateCount, this)
    eventsManager.on(EVENTS.UPDATE_STATS, this.updateStats, this)
    eventsManager.on(EVENTS.TOGGLE_MUTE, this.toggleMute, this)
  }

  createStatsBox() {
    // this.scoreLabel = this.add.text(10, 10, 'People saved: 0', {
    //   fontFamily: EIGHTBIT_WONDER,
    //   fontSize: "32px"
    // })
    const labelX = 10
    const firstLabelY = 20
    const firstValueY = firstLabelY + 4;
    const valueTextSize = 32
    const rowHeight = valueTextSize + 3
    const valueX = 240
    const labelStyle = { fontFamily: EIGHTBIT_WONDER, fontSize: "16px", color: "#00FFFF" }
    const valueTextStyle = { fontFamily: EIGHTBIT_WONDER, fontSize: `${valueTextSize}px`, color: "#FF0099" }

    this.add.text(labelX, firstLabelY, "Pods escaped:", labelStyle)
    this.add.text(labelX, firstLabelY + rowHeight, "Pods destroyed:", labelStyle)
    this.add.text(labelX, firstLabelY + rowHeight * 2, "Meteors hit:", labelStyle)

    this.podsSavedLabel = this.add.text(valueX, firstValueY, '0', valueTextStyle).setOrigin(0, .32)
    this.podsLostLabel = this.add.text(valueX, firstValueY + rowHeight, '0', valueTextStyle).setOrigin(0, .32)
    this.meteorHitsLabel = this.add.text(valueX, firstValueY + rowHeight * 2, '0', valueTextStyle).setOrigin(0, .32)
  }

  // updateCount(count: number) {
  //   this.scoreLabel.text = `People saved: ${count}`
  // }

  updateStats(stat: STAT_CHANGE, newValue: number) {
    if (stat === STAT_CHANGE.PodEscaped) {
      this.podsSavedLabel.text = newValue.toString()
    }
    if (stat === STAT_CHANGE.PodDestroyed) {
      this.podsLostLabel.text = newValue.toString()
    }
    if (stat === STAT_CHANGE.MeteorHitGround) {
      this.meteorHitsLabel.text = newValue.toString()
    }
  }

  advanceTutorial(step: TutorialStep) {
    if (this.#tutorialStep === 0 && step === TutorialStep.FIRST_METEOR) {
      this.nextTutorialStep(true)
    } else if (this.#tutorialStep === 1 && step === TutorialStep.PREPARE_FOR_DESTRUCTION) {
      this.nextTutorialStep(true)
    } else if (this.#tutorialStep === 2 && step === TutorialStep.SHIELD_HIT) {
      this.nextTutorialStep()
    } else if (this.#tutorialStep === 3 && step === TutorialStep.SHIP_CREATED) {
      this.nextTutorialStep()
    } else if (this.#tutorialStep === 4 && step === TutorialStep.SHIP_DESTROYED) {
      this.nextTutorialStep()
    } else if (this.#tutorialStep === 5 && step === TutorialStep.SHIP_SAVED) {
      this.nextTutorialStep()
      this.#tutorialCooldown = this.#tutorialCooldownMax * 2
    }
  }

  update(time: number, delta: number) {
    delta /= 1000

    this.systemLabelCooldown -= delta;
    if (this.systemLabelCooldown < 0 && this.systemLabel.text != "") {
      // this.systemLabel.setAlpha(Phaser.Math.Clamp(this.systemLabelCooldown, 0, 1))
      this.systemLabel.text = ""
    }

    if (this.#tutorialStep < 7) {
      this.#tutorialCooldown -= delta;
    }

    if (this.#tutorialStep === 6 && this.#tutorialCooldown < 0) {
      this.nextTutorialStep();
    }
  }

  nextTutorialStep(overrideCooldown: boolean = false) {
    // console.log(this.#tutorialCooldown)
    if (overrideCooldown || this.#tutorialCooldown < 0) {
      this.#tutorialCooldown = this.#tutorialCooldownMax
      this.#tutorialStep += 1;
      this.setTutorialLabelToStep()
    }
  }

  setTutorialLabelToStep() {
    this.#tutorialLabel.text = this.tutorialTexts[this.#tutorialStep]
    this.#tutorialLabel.x = this.cameras.main.width / 2 - this.#tutorialLabel.width / 2
  }

  toggleMute() {
    this.#muteOn.visible = this.sound.mute;
    this.#muteOff.visible = !this.sound.mute;
  }
  
  createMuteIndicator() {
    const cameraWidth = this.cameras.default.width;

    const size = 32;
    const x = cameraWidth - size;
    const y = size;

    this.#muteOn = this.add.image(x, y, "muteOn");
    this.#muteOn.visible = !this.sound.mute;
    this.#muteOff = this.add.image(x, y, "muteOff");
    this.#muteOff.visible = this.sound.mute;  }
}
