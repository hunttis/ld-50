export const EVENTS = {
    POD_ESCAPED: 'event-pod-escaped',
    UPDATE_SCORE: 'event-update-score',
    EXPLOSION: 'explosion',
    METEOR_HITS: 'meteor-hits',
}

export const eventsManager = new Phaser.Events.EventEmitter()