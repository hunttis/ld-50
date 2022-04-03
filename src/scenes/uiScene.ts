import { EVENTS, STAT_CHANGE, eventsManager } from "../eventsManager";

export enum TutorialStep {
  FIRST_METEOR,
  PREPARE_FOR_DESTRUCTION,
  SHIELD_HIT,
  SHIP_CREATED,
  SHIP_DESTROYED,
  SHIP_SAVED,
}

export class UiScene extends Phaser.Scene {
  scoreLabel!: Phaser.GameObjects.Text;
  podsSavedLabel!: Phaser.GameObjects.Text;
  podsLostLabel!: Phaser.GameObjects.Text;
  meteorHitsLabel!: Phaser.GameObjects.Text;

  systemLabel!: Phaser.GameObjects.Text;
  systemLabelCooldown: number = 2;

  #tutorialStep: number = 0
  #tutorialLabel!: Phaser.GameObjects.Text;
  #tutorialCooldownMax: number = 2
  #tutorialCooldown: number = this.#tutorialCooldownMax
  
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
    super({ key: "UiScene", active: true });
  }

  create() {
    console.log("UI create");

    this.scoreLabel = this.add.text(10, 10, 'People saved: 0', {
      fontSize: "32px"
    })

    this.podsSavedLabel = this.add.text(10, 100, '0', {
      fontSize: "32px"
    })
    this.podsLostLabel = this.add.text(10, 150, '0', {
      fontSize: "32px"
    })
    this.meteorHitsLabel = this.add.text(10, 200, '0', {
      fontSize: "32px"
    })

    this.systemLabel = this.add.text(1280, 700, 'System', {
      fontSize: "16px"
    })
    this.systemLabel.x -= this.systemLabel.width + 10

    this.#tutorialLabel = this.add.text(
      this.cameras.main.width / 2,
      600,
      this.tutorialTexts[this.#tutorialStep],
      {fontSize: "32px"}
    )
    this.#tutorialLabel.x -= this.#tutorialLabel.width / 2

    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.#pauseLabel = this.add.text(screenCenterX, screenCenterY, "GAME PAUSED", {
      //backgroundColor: "#000",
      fontSize: "128px",
      shadow: { offsetX: 10, offsetY: 10, color: "#0f0f0f", blur: 25 }
    })
    .setOrigin(.5, .5)
    //.setShadow()
    .setVisible(false)

    var pauseKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P);
    pauseKey.on('down', () => {
      eventsManager.emit(EVENTS.PAUSE_GAME)
      this.#pauseLabel.setVisible(!this.#pauseLabel.visible)
    });

    eventsManager.on(EVENTS.TUTORIAL_ADVANCE, this.advanceTutorial, this)
    eventsManager.on(EVENTS.UPDATE_SCORE, this.updateCount, this)
    eventsManager.on(EVENTS.UPDATE_STATS, this.updateStats, this)
    eventsManager.on(EVENTS.TOGGLE_MUTE, this.toggleMute, this)
  }

  updateCount(count: number) {
    this.scoreLabel.text = `People saved: ${count}`
  }

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
    this.systemLabelCooldown = 2;
    this.systemLabel.text = "Sounds on: " + !this.sound.mute
    this.systemLabel.x = 1280 - (this.systemLabel.width + 10)

    console.log("Toggling mute:", this.sound.mute)
  }
  

}
