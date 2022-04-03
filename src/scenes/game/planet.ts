import { CollisionGroup } from "./collisions";
import { PlanetLocation } from "./planetLocation";
import { Shield } from "./shield";

const ROCKET_BUILD_TIME = 5

export class Planet {

    #planetSprite: Phaser.GameObjects.Sprite;
    #locations: PlanetLocation[]
    #activeLocations: PlanetLocation[]
    #timer?: Phaser.Time.TimerEvent
    #countdownText: Phaser.GameObjects.Text;

    constructor(readonly scene: Phaser.Scene, xLoc: number, yLoc: number, radius: number = 60) {
        this.#planetSprite = this.scene.add.sprite(xLoc, yLoc, "planet")

        const circumference = radius * 2 * Math.PI
        const segmentCount = 10
        const segmentRadius = circumference / segmentCount / 2

        this.#locations = []
        for (let i = 0; i < segmentCount; i++) {
          const angle = Phaser.Math.DegToRad(i * (360 / segmentCount))

          const x = radius * Math.cos(angle) + xLoc;
          const y = radius * Math.sin(angle) + yLoc;

          const location = new PlanetLocation(scene, x, y, segmentRadius, angle, this.onMeteorCollision)
          this.#locations.push(location)
        }
        this.#activeLocations = this.#locations.slice()

        this.#countdownText = scene.add.text(xLoc, yLoc, "")
        this.#countdownText.setFontFamily("sans-serif")
        this.#countdownText.setFontSize(28)
        this.#countdownText.setOrigin(0.5, 0.5)
    }

    start() {
        this.#timer = this.scene.time.addEvent({delay: ROCKET_BUILD_TIME * 1000, callback: this.#buildRocket})
    }

    #buildRocket = () => {
        const validLocations = this.#activeLocations.filter(loc => loc.isValid)
        const loc = validLocations[Phaser.Math.Between(0, validLocations.length - 1)]
        if (!loc) return
        loc.createShip()

        this.#timer?.destroy()
        this.#timer = this.scene.time.addEvent({delay: 5000, callback: this.#buildRocket})
    }

    onMeteorCollision = (location: PlanetLocation) => {
        const idx = this.#activeLocations.indexOf(location)
        this.#activeLocations.splice(idx, 1)
    }

    onSegmentCollide = (pair: unknown) => {
    }

    update(d: number) {
        if (this.#timer) {
            const remaining = Math.round(ROCKET_BUILD_TIME - this.#timer.getElapsedSeconds())
            this.#countdownText.text = `${remaining}`
        }
        this.#locations.forEach(loc => loc.update(d))
    }

    getCenter() {
        return this.#planetSprite.getCenter()
    }

    destroy() {
        this.#timer?.destroy()
    }
    
    get isCompletelyOnFire() {
        return this.#locations.filter(loc => !loc.isOnFire).length === 0
    }
}
