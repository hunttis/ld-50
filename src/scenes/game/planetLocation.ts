import { CollisionGroup } from "./collisions"
import { Ship } from "./ship"

export class PlanetLocation {
    readonly #sensor: MatterJS.BodyType
    readonly #x: number
    readonly #y: number
    readonly #angle: number

    #ship!: Ship
    #onFire: boolean = false
    #fireManager: Phaser.GameObjects.Particles.ParticleEmitterManager
    #fireEmitter!: Phaser.GameObjects.Particles.ParticleEmitter
    #onMeteorCollision: (location: PlanetLocation) => void

    #launchKey


    constructor(readonly scene: Phaser.Scene, x: number, y: number, radius: number, angle: number, onMeteorCollision: (location: PlanetLocation) => void) {
        this.#x = x
        this.#y = y
        this.#angle = angle
        this.#onMeteorCollision = onMeteorCollision
        this.#sensor = this.scene.matter.add.rectangle(x, y, 34, 4, {
            ignoreGravity: true,
            isSensor: true,
            onCollideCallback: this.onCollide,
            collisionFilter: {
                category: CollisionGroup.Planet,
                group: CollisionGroup.Meteor
            },
            angle: angle + Math.PI / 2
        })
        this.#launchKey = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);

        this.#fireManager = scene.add.particles('flame')
    }

    createShip() {
        if (this.#ship) return

        this.#ship = new Ship(this.scene, this.#x, this.#y, this.#angle)
    }

    get isValid() {
        return !this.#ship
    }

    get isOnFire() {
        return this.#onFire
    }

    update(d:number) {
        if (this.#onFire && !this.#fireEmitter) {
            
            this.#fireEmitter = this.#fireManager.createEmitter({
                scale: {start: 0.5, end: 0},
                alpha: {start: 1, end: 0},
                lifespan: {min: 100, max: 1000},
                speed: {min: 10, max: 25},
                quantity: 10              
            })
            this.#fireEmitter.setAngle(Phaser.Math.RadToDeg(this.#angle))
            const point0 = this.#sensor.vertices?.[0]!
            const point1 = this.#sensor.vertices?.[1]!
            
            // const line = new Phaser.Geom.Line(point0!.x, point0!.y, point1!.x, point1!.y)
            // const zoneConfig = {
            //     source: line,
            //     type: 'edge',
            //     quantity: 10,
            // }
            const zoneConfig = {
                source: new Phaser.Geom.Circle(this.#x, this.#y, 20),
                type: "random",
                quantity: 10
            }

            this.#fireEmitter.setEmitZone(zoneConfig)
            this.#fireEmitter.setBlendMode(Phaser.BlendModes.ADD)    
        }
        if (this.#ship) {
            this.#ship.update(d)

            if (!this.#onFire && this.#launchKey.isDown) {
                if (this.#ship.active) {
                    this.#ship.launch()
                }
            }
        }
    }

    onCollide = (
      pair: unknown
    ) => {
        if (!this.#onFire) {
            this.#onMeteorCollision(this)
        } 
        this.#onFire = true
        if (this.#ship) {
            this.#ship.destroy()
        }
    }
}
