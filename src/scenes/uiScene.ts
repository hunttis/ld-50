export class UiScene extends Phaser.Scene {
  scoreLabel!: Phaser.GameObjects.Text;

  constructor() {
    super({ active: false, visible: false });
    Phaser.Scene.call(this, { key: "UiScene" });
    console.log("UI construct");
  }

  create() {
    console.log("UI create");

    this.scoreLabel = this.add.text(10, 10, 'Count: 0', {
      fontSize: "32px"
    })
  }

  updateCount(count: number) {
    this.scoreLabel.text = `Count: ${count}`
  }
}
