import { GameScene } from "./scenes/gameScene";
import { MenuScene } from "./scenes/menuScene";
import { UiScene } from "./scenes/uiScene";

export function startGame() {
  const config: Phaser.Types.Core.GameConfig = {
    title: "Phaser game",
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: 1280,
      height: 720,
    },
    physics: {
      default: "matter",
      matter: {
        // debug: {
        //   showBody: true,
        //   showStaticBody: true,
        //   showSensors: true
        // }
      },
    },
    parent: "game",
    backgroundColor: "#0f0f0f",
    scene: [GameScene, UiScene]
  };

  return new Phaser.Game(config);
}
