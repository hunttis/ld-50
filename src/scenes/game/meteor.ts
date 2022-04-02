import { CollisionGroup } from "./collisions";

export class Meteor extends Phaser.Physics.Matter.Sprite {

    constructor(readonly scene: Phaser.Scene, xLoc: number, yLoc: number) {
        super(scene.matter.world, xLoc, yLoc, "meteor")
        this.setCircle(8)
        this.setIgnoreGravity(true)
        this.setMass(1)

        this.setOnCollide((pair: any) => {
            console.log('Meteor collided with: ', pair.bodyA?.gameObject?.name, 'and other side is: ', pair.bodyB?.gameObject?.name)
        })
        this.setCollisionCategory(CollisionGroup.Meteor)
        this.setCollidesWith(CollisionGroup.Shield | CollisionGroup.Ship | CollisionGroup.Planet)
        this.setOnCollide((pair: any) => {
          this.destroy()
        })

        this.name = "Meteor"
        scene.add.existing(this)
    }

    update(planetLoc: Phaser.Math.Vector2, time: number, delta: number) {
        if (!this.body) return

        const angleToPlanet = Phaser.Math.Angle.BetweenPoints(this.getCenter(), planetLoc)
        this.angle = Phaser.Math.RadToDeg(angleToPlanet)
        // TODO: increase thrust value over time + randomize a bit
        this.thrust(.005 * delta)
    }
}