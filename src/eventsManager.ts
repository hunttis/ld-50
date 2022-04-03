export const EVENTS = {
    PODS_LAUNCHED: 'pods-launched',
    POD_ESCAPED: 'pod-escaped',
    POD_DESTROYED: 'pod-destroyed',
    UPDATE_SCORE: 'update-score',
    UPDATE_STATS: 'update-stats',
    EXPLOSION: 'explosion',
    METEOR_HITS_GROUND: 'meteor-hits-ground',
    SHIELD_TURNING: 'shield-turning',
    FLAMETRAIL: 'flametrail',
    TUTORIAL_ADVANCE: 'tutorial-advance',
    SMOKETRAIL: 'smoketrail',
    TOGGLE_MUTE: 'toggle-mute',
    PAUSE_GAME: 'pause-game',
    SHIELD_STOPPED: 'shield-stopped',
}

export enum STAT_CHANGE {
    PodEscaped,
    PodDestroyed,
    MeteorHitGround
}

export const eventsManager = new Phaser.Events.EventEmitter()