class SceneA extends Phaser.Scene {
  constructor() {
    super("scene-a");
  }

  preload() {
    //        this.load.spritesheet('mummy', 'assets/animations/mummy37x45.png', { frameWidth: 37, frameHeight: 45 });
    this.load.spritesheet("mummy", "assets/images/meteorAnim.png", {
      frameWidth: 32,
      frameHeight: 32,
    })
  }

  create() {
    console.log('AnimMan:', this.anims)
    const mummyAnimation: Phaser.Animations.Animation = this.anims.create({
      key: 'walk',
      frames: 'mummy',
      //frames: this.anims.generateFrameNumbers('mummy', { start: 0, end: 1 }),
      frameRate: 24,
      repeat: -1
    }) as Phaser.Animations.Animation;
    console.log('Anim:', mummyAnimation)

    const sprite = this.add.sprite(300, 200, 'mummy').setScale(4);

    console.log('walk:', this.anims.get("walk"))
    //sprite.play({ key: 'walk', repeat: -1 });
    sprite.play(mummyAnimation);
  }
}

const config = {
  type: Phaser.AUTO,
  parent: 'game',
  width: 800,
  height: 600,
  pixelArt: true,
  scene: [SceneA]
};

export function startGame() {
  return new Phaser.Game(config);
}
