import { EVENTS, eventsManager } from "../../eventsManager";
import { Planet } from "./planet";
import { ShieldSegment } from "./shieldSegment";

export class Shield extends Phaser.GameObjects.Group {
  cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  #xLoc;
  #yLoc;
  #explosionManager: Phaser.GameObjects.Particles.ParticleEmitterManager;
  #radius;

  constructor(
    readonly scene: Phaser.Scene,
    xLoc: number,
    yLoc: number,
    planet: Planet,
    radius: number = 152
  ) {
    super(scene);

    this.#xLoc = xLoc;
    this.#yLoc = yLoc;
    this.#radius = radius;

    // seg height 8
    const segmentWidth = 48;

    const circumference = this.#radius * 2 * Math.PI;
    const segmentCount = circumference / segmentWidth;

    this.cursors = scene.input.keyboard.createCursorKeys();

    for (let i = 0; i < segmentCount; i++) {
      const angle = Phaser.Math.DegToRad(i * (360 / segmentCount));

      const x = this.#radius * Math.cos(angle) + xLoc;
      const y = this.#radius * Math.sin(angle) + yLoc;

      const shieldSeg = new ShieldSegment(scene, x, y, angle);
      this.add(shieldSeg);
    }
    this.#explosionManager = scene.add.particles("meteor");
  }

  removeCallback = (obj: Phaser.GameObjects.GameObject) => {
    // TODO: Better texture
    const segment = obj as ShieldSegment;
    const emitter = this.#explosionManager.createEmitter({});
    emitter.setLifespan(300);
    emitter.setSpeed(200);
    emitter.setScale(0.3);
    emitter.setTint(0xff4400);
    emitter.setBlendMode(Phaser.BlendModes.ADD);
    emitter.explode(20, segment.x, segment.y);
    eventsManager.emit(EVENTS.SHIELD_SEGMENT_DESTROYED);
  };

  #shieldSegments(): ShieldSegment[] {
    return this.getChildren() as ShieldSegment[];
  }

  get isCompletelyGone() {
    return this.getChildren().length === 0;
  }

  update(delta: number) {
    let angle = this.cursors.left!.isDown ? -0.02 : 0;
    angle += this.cursors.right!.isDown ? 0.02 : 0;

    if (angle) {
      const segments = this.#shieldSegments();
      Phaser.Actions.RotateAroundDistance(
        segments,
        { x: this.#xLoc, y: this.#yLoc },
        angle,
        this.#radius
      );

      eventsManager.emit(EVENTS.SHIELD_TURNING);

      segments.forEach((segment) => {
        segment.setAngle(
          Phaser.Math.RadToDeg(
            Phaser.Math.Angle.BetweenPoints(
              { x: this.#xLoc, y: this.#yLoc },
              segment.getCenter()
            )
          )
        );
      });
    } else {
      eventsManager.emit(EVENTS.SHIELD_STOPPED);
    }
  }
}
