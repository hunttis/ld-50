export class BigMeteor extends Phaser.GameObjects.Sprite {
    constructor(scene: Phaser.Scene) {
        super(scene, 1700, 350, 'meteor'); 
        this.scaleX = 30
        this.scaleY = 30
        scene.add.existing(this)
    }

    update(delta: number) {
        if (this.x > this.scene.cameras.default.width / 2) {
            this.x -= 800 * delta;
        }
    }
}