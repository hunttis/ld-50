import { CollisionGroup } from "./collisions";

export class ShieldSegment extends Phaser.Physics.Matter.Sprite {
  #shieldMaxLevel = 3
  #energyLevel: number

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
    super(scene.matter.world, x, y, 'shield')
    this.name = "Shield"

    this.#energyLevel = this.#shieldMaxLevel
    this.setSensor(true)
    this.setIgnoreGravity(true)

    this.setAngle(Phaser.Math.RadToDeg(angle))
    this.setCollisionCategory(CollisionGroup.Shield)
    this.setCollidesWith(CollisionGroup.Meteor | CollisionGroup.Ship)
    this.setOnCollide((pair: any) => {
      const a = pair.bodyA?.gameObject?.name
      const b = pair.bodyB?.gameObject?.name
      if (a === "Meteor" || b === "Meteor") {
        this.#energyLevel--
        if (this.#energyLevel === 0) {
          this.destroy()
        }
      }
    })

    this.scene.add.existing(this)
  }

  get energyLevel() {
    return this.#energyLevel
  }
}
