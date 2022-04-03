import { EVENTS, eventsManager } from "./eventsManager";

export class FxManager {

    #starManager: Phaser.GameObjects.Particles.ParticleEmitterManager
    #explosionManager: Phaser.GameObjects.Particles.ParticleEmitterManager
    #smokeManager: Phaser.GameObjects.Particles.ParticleEmitterManager

    #starEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    #explosionEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    #flameEmitter: Phaser.GameObjects.Particles.ParticleEmitter
    #smokeEmitter: Phaser.GameObjects.Particles.ParticleEmitter

    #asteroidCreateSound!: Phaser.Sound.BaseSound
    #asteroidHitPlanetSound!: Phaser.Sound.BaseSound
    #asteroidHitShieldSound!: Phaser.Sound.BaseSound
    #rocketHitShieldSound!: Phaser.Sound.BaseSound
    #rocketLaunchSound!: Phaser.Sound.BaseSound
    #shieldRotateSound!: Phaser.Sound.BaseSound

    constructor(scene: Phaser.Scene) {

        this.#starManager = scene.add.particles('stars')
        this.#starManager.setDepth(-1)
        this.#starEmitter = this.#starManager.createEmitter({
            scale: { start: 1.5, end: 0},
            // angle: {min: 0, max: 360},
            lifespan: { min: 5000, max: 10000},
            alpha: {start: 0, end: 1},
            // rotate: {min: 0, max: 100},
            emitZone: {
                source: new Phaser.Geom.Rectangle(0, 0, 1280, 720),
                type: 'random',
                quantity: 1
            },
            // frequency: 1,
            
        })
                

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
        eventsManager.on(EVENTS.SHIELD_STOPPED, this.shieldStopped, this)
        eventsManager.on(EVENTS.FLAMETRAIL, this.flameTrail, this)
        eventsManager.on(EVENTS.SMOKETRAIL, this.smokeTrail, this)

        this.#asteroidCreateSound = scene.game.sound.add("sfx_asteroid_create", {volume: 1})
        this.#asteroidHitPlanetSound = scene.game.sound.add("sfx_asteroid_hit_planet", {volume: 1})
        this.#asteroidHitShieldSound = scene.game.sound.add("sfx_asteroid_hit_shield", {volume: 1})
        this.#rocketHitShieldSound = scene.game.sound.add("sfx_rocket_hit_shield", {volume: 1})
        this.#rocketLaunchSound = scene.game.sound.add("sfx_rocket_launch", {volume: 1})
        this.#shieldRotateSound = scene.game.sound.add("sfx_shield_rotate", {volume: 1})
    
    }

    explosion(xLoc: number , yLoc: number) {
        this.#explosionEmitter.explode(20, xLoc, yLoc)
        this.#asteroidHitShieldSound.play()
    }

    groundCollision(xLoc: number, yLoc: number) {
        this.#asteroidHitPlanetSound.play()
    }

    shieldTurning() {
        if (!this.#shieldRotateSound.isPlaying) {
            this.#shieldRotateSound.play()
        }
    }

    shieldStopped() {
        if (this.#shieldRotateSound.isPlaying) {
            this.#shieldRotateSound.stop()
        }
    }

    flameTrail(xLoc: number, yLoc: number) {
        // this.#flameEmitter.setPosition(xLoc, yLoc)
        this.#flameEmitter.explode(2, xLoc, yLoc)
    }

    smokeTrail(xLoc: number, yLoc: number, angle: number) {
        this.#smokeEmitter.explode(2, xLoc, yLoc)

    }
}
