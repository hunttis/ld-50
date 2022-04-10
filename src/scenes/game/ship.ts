import { CollisionGroup } from "./collisions";
import { EVENTS, eventsManager } from "../../eventsManager";
import { TutorialStep } from "../uiScene";

enum ShipState {
    Launching,
    Flying,
    Warping
}

const LAUNCH_DELAY = 2
const FLYING_DELAY = 3

export class Ship extends Phaser.Physics.Matter.Sprite{
    #state: ShipState = ShipState.Launching
    #destroyed = false
    #saved = false

    #text: Phaser.GameObjects.Text;
    #timerEvent?: Phaser.Time.TimerEvent;

    constructor(readonly scene: Phaser.Scene, xLoc: number, yLoc: number, angle: number) {
        super(scene.matter.world, xLoc, yLoc, 'rocket')
        this.name = "ship"

        this.setIgnoreGravity(true)
        this.setCollisionCategory(CollisionGroup.Ship)
        this.setCollidesWith(CollisionGroup.Meteor | CollisionGroup.Shield)

        this.setAngle(Phaser.Math.RadToDeg(angle));
        this.scene.add.existing(this)

        this.setOnCollide(() => {
            this.#destroyed = true
            if (this.body){
                eventsManager.emit(EVENTS.TUTORIAL_ADVANCE, TutorialStep.SHIP_DESTROYED)
                eventsManager.emit(EVENTS.EXPLOSION, this.x, this.y)
                eventsManager.emit(EVENTS.POD_DESTROYED)
            }
            this.destroy()
        })

        // this.#timerEvent = this.scene.time.addEvent({delay: LAUNCH_DELAY * 1000, callback: this.launch})

        const tx = -30 * Math.cos(angle) + xLoc;
        const ty = -30 * Math.sin(angle) + yLoc;

        this.#text = this.scene.add.text(tx, ty, "")
        this.#text.setOrigin(0.5, 0.5)

    }

    launch = () => {
        this.#state = ShipState.Flying;
        this.#text.setText("")
        this.#timerEvent = this.scene.time.addEvent({delay: FLYING_DELAY * 1000, callback: this.#warp})
        eventsManager.emit(EVENTS.PODS_LAUNCHED)
        eventsManager.emit(EVENTS.SHIP_LAUNCH)
    }

    #warp = () => {
        if (!this.#saved && !this.#destroyed) {
            eventsManager.emit(EVENTS.TUTORIAL_ADVANCE, TutorialStep.SHIP_SAVED)
            eventsManager.emit(EVENTS.POD_ESCAPED)
            this.#saved = true
        }
        this.#state = ShipState.Warping
        this.destroy()
    }

    update(delta: number) {
        if (!this.body) {
            return
        }

        // if (this.#state === ShipState.Launching) {
        //     const remaining = Math.round(LAUNCH_DELAY - this.#timerEvent!.getElapsedSeconds())
        //     this.#text.setText(""+ remaining)
        // }
        if (this.#state === ShipState.Flying) {
            this.thrust(0.0002)
            eventsManager.emit(EVENTS.SMOKETRAIL, this.x, this.y, this.angle)
        }
    }

    get isDestroyed() {
        return this.#destroyed
    }

    get isGrounded() {
        return this.#state === ShipState.Launching
    }

    destroy() {
        super.destroy()
        this.#timerEvent?.destroy()
        this.#text.destroy()
        this.#destroyed = true
    }
}
