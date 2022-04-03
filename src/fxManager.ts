import { EVENTS, eventsManager } from "./eventsManager";

export class FxManager {

    #explosionManager: Phaser.GameObjects.Particles.ParticleEmitterManager
    #smokeManager: Phaser.GameObjects.Particles.ParticleEmitterManager

    #explosionEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    #flameEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    #smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

    constructor(scene: Phaser.Scene) {

        this.#explosionManager = scene.add.particles('flame')
        
        this.#explosionEmitter = this.#explosionManager.createEmitter({
            scale: { start: 2, end: 0},
            angle: {min: 0, max: 360},
            lifespan: { min: 100, max: 300},
            speed: { min: 100, max: 300},
            rotate: {min: 0, max: 100}
        })
        this.#explosionEmitter.setPosition(-100, -100);

        this.#flameEmitter = this.#explosionManager.createEmitter({
            scale: { start: 1, end: 0},
            angle: {min: 0, max: 360},
            lifespan: { min: 100, max: 300},
            speed: { min: 100, max: 300},
            rotate: {min: 0, max: 100}
        })
        this.#flameEmitter.setPosition(-100, -100);

        this.#smokeManager = scene.add.particles('smoke')
        this.#smokeEmitter = this.#smokeManager.createEmitter({
            scale: { start: 1, end: 0},
            // angle: {min: 0, max: 360},
            lifespan: { min: 100, max: 300},
            speed: { min: 30, max: 30},
        })
        this.#smokeEmitter.setPosition(-100, -100);

        eventsManager.on(EVENTS.EXPLOSION, this.explosion, this)
        eventsManager.on(EVENTS.SHIELD_TURNING, this.shieldTurning, this)
        eventsManager.on(EVENTS.FLAMETRAIL, this.flameTrail, this)
        eventsManager.on(EVENTS.SMOKETRAIL, this.smokeTrail, this)
    }

    explosion(xLoc: number , yLoc: number) {
        // TODO Räjähdysääni
        this.#explosionEmitter.explode(20, xLoc, yLoc)
    }

    groundCollision(xLoc: number, yLoc: number) {
        // TODO Räjähdysääni
    }

    shieldTurning() {
        // TODO Tarkista soiko ääni ja soita ääntä
    }

    flameTrail(xLoc: number, yLoc: number) {
        // this.#flameEmitter.setPosition(xLoc, yLoc)
        this.#flameEmitter.explode(2, xLoc, yLoc)
    }

    smokeTrail(xLoc: number, yLoc: number, angle: number) {
        this.#smokeEmitter.explode(2, xLoc, yLoc)
    }
}
