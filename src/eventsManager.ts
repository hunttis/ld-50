export const EVENTS = {
    PODS_LAUNCHED: 'pods-launched',
    POD_ESCAPED: 'pod-escaped',
    POD_DESTROYED: 'pod-destroyed',
    UPDATE_SCORE: 'update-score',
    UPDATE_STATS: 'update-stats',
    EXPLOSION: 'explosion',
    METEOR_HITS_GROUND: 'meteor-hits-ground',
    SHIELD_TURNING: 'shield-turning',
    SHIELD_SEGMENT_DESTROYED: 'shield-segment-destroyed',
    FLAMETRAIL: 'flametrail',
    TUTORIAL_ADVANCE: 'tutorial-advance',
    SMOKETRAIL: 'smoketrail',
    TOGGLE_MUTE: 'toggle-mute',
    PAUSE_GAME: 'pause-game',
    SHIELD_STOPPED: 'shield-stopped',
    SHIP_LAUNCH: 'ship-launch',
}

export enum STAT_CHANGE {
    PodEscaped,
    PodDestroyed,
    MeteorHitGround
}

class CustomEventEmitter extends Phaser.Events.EventEmitter {
    addSingletonListener(event: string | symbol, fn: Function, context?: any): CustomEventEmitter {
        super.removeListener(event);
        super.addListener(event, fn, context)
        return this;
    }
}

export const eventsManager = new CustomEventEmitter();