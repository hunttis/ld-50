export class GameOverScene extends Phaser.Scene {
  commonFontStyle = {
    //fontFamily: "Monospace",
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

  podsEscaped: number

  constructor(podsEscaped: number) {
    super({ active: false, visible: false })
    this.podsEscaped = podsEscaped
  }

  create() {
    const peopleSaved = this.podsEscaped * 100

    const headerText = "🎖 Game over 🎖"

    const descriptionText =
      "The planet was destroyed.\n\n"
      + "But thanks to your valiant efforts defending it and\n"
      + "your courageous self-sacrifice, some of the planet's\n"
      + "richest inhabitants with escape pods managed to escape."

    const scoreText = peopleSaved + " people escaped."

    const statisticText = "(That's "
      + (peopleSaved / 7_000_000_000)
      + "% of the planet's population.)"

    // const screenCenterX = this.cameras.main.worldView.x + this.cameras.main.width / 2;
    // const screenCenterY = this.cameras.main.worldView.y + this.cameras.main.height / 2;
    const screenCenterX = this.scale.width / 2;
    const screenCenterY = this.scale.height / 2;
    const screenOneThirdY = this.scale.height / 3;

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
  }
}
