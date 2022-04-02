import { EVENTS, eventsManager } from "../eventsManager";

export class UiScene extends Phaser.Scene {
  scoreLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: "UiScene", active: true });
  }

  create() {
    console.log("UI create");

    this.scoreLabel = this.add.text(10, 10, 'People saved: 0', {
      fontSize: "32px"
    })

    eventsManager.on(EVENTS.UPDATE_SCORE, this.updateCount, this)
  }

  updateCount(count: number) {
    this.scoreLabel.text = `People saved: ${count}`
  }
}
