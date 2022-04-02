import { GameOverScene } from "./scenes/gameOverScene";

export function startGame(peopleSaved: number) {
  const config: Phaser.Types.Core.GameConfig = {
    title: "Phaser game",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720,
    },
    parent: "game",
    backgroundColor: "#0f0f0f",
    scene: new GameOverScene(peopleSaved),
  };

  return new Phaser.Game(config);
}
