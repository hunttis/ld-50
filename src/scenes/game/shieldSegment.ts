import { CollisionGroup } from "./collisions";

export class ShieldSegment extends Phaser.Physics.Matter.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
    super(scene.matter.world, x, y, 'shield')
    this.name = "Shield"

    this.setSensor(true)
    this.setIgnoreGravity(true)

    this.setAngle(Phaser.Math.RadToDeg(angle))
    this.setCollisionCategory(CollisionGroup.Shield)
    this.setCollidesWith(CollisionGroup.Meteor | CollisionGroup.Ship)
    this.setOnCollide((pair: any) => {
      const a = pair.bodyA?.gameObject?.name
      const b = pair.bodyB?.gameObject?.name
      if (a === "Meteor" || b === "Meteor") {
        this.destroy()
      }
    })

    this.scene.add.existing(this)
  }
}
