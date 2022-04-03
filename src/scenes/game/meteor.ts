import { CollisionGroup } from "./collisions";
import { EVENTS, eventsManager } from "../../eventsManager";


export class Meteor extends Phaser.Physics.Matter.Sprite {

    #emitterManager!: Phaser.GameObjects.Particles.ParticleEmitterManager
    #emitter!: Phaser.GameObjects.Particles.ParticleEmitter
    #damage: number = 1

    constructor(readonly scene: Phaser.Scene, xLoc: number, yLoc: number, damage: number = 1) {
        super(scene.matter.world, xLoc, yLoc, "animatedmeteor")

        this.setCircle(8)
        this.setIgnoreGravity(true)
        this.setMass(1)

        this.setOnCollide((pair: any) => {
            console.log('Meteor collided with: ', pair.bodyA?.gameObject?.name, 'and other side is: ', pair.bodyB?.gameObject?.name)
        })
        this.setCollisionCategory(CollisionGroup.Meteor)
        this.setCollidesWith(CollisionGroup.Shield | CollisionGroup.Ship | CollisionGroup.Planet)
        this.setOnCollide((pair: any) => {
            const a = pair.bodyA?.gameObject
            const b = pair.bodyB?.gameObject
            if (a?.name === "Meteor") {
                eventsManager.emit(EVENTS.EXPLOSION, a.x, a.y)
            } else if (b?.name === "Meteor") {
                eventsManager.emit(EVENTS.EXPLOSION, b.x, b.y)
            }
            this.destroy()
        })

        this.#damage = damage

        this.name = "Meteor"
        scene.add.existing(this)
        if (this.#damage === 3) {
            this.tint = 0xff0000
        }
    }

    get damage() {
        return this.#damage
    }

    update(planetLoc: Phaser.Math.Vector2, time: number, delta: number) {
        if (!this.body) return

        const angleToPlanet = Phaser.Math.Angle.BetweenPoints(this.getCenter(), planetLoc)
        this.angle = Phaser.Math.RadToDeg(angleToPlanet)
        // TODO: increase thrust value over time + randomize a bit
        this.thrust(.005 * delta)
        // this.play("meteorspin")
        
        if (this.#damage === 3) {
            eventsManager.emit(EVENTS.FLAMETRAIL, this.x, this.y)
        }

    }
}