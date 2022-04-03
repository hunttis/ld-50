import { eventsManager, EVENTS } from "../../eventsManager";
import { TutorialStep } from "../uiScene";
import { CollisionGroup } from "./collisions";
import { Meteor } from "./meteor";

const SHIELD_MAX_LEVEL = 3

export class ShieldSegment extends Phaser.Physics.Matter.Sprite {
  #energyLevel: number

  constructor(scene: Phaser.Scene, x: number, y: number, angle: number) {
    super(scene.matter.world, x, y, 'shield')
    this.name = "Shield"

    this.#energyLevel = SHIELD_MAX_LEVEL
    this.setSensor(true)
    this.setIgnoreGravity(true)

    this.setAngle(Phaser.Math.RadToDeg(angle))
    this.setCollisionCategory(CollisionGroup.Shield)
    this.setCollidesWith(CollisionGroup.Meteor | CollisionGroup.Ship)
    this.setOnCollide((pair: any) => {
      const a = pair.bodyA?.gameObject?.name
      const b = pair.bodyB?.gameObject?.name
      if (a === "Meteor" || b === "Meteor") {
        let meteor;
        eventsManager.emit(EVENTS.TUTORIAL_ADVANCE, TutorialStep.SHIELD_HIT)

        if (a === "Meteor") {
          meteor = pair.bodyA.gameObject as Meteor;
        } else {
          meteor = pair.bodyB.gameObject as Meteor;
        }
        console.log(meteor.damage)
        this.#energyLevel -= meteor!.damage
        if (this.#energyLevel === 0) {
          this.destroy()
        } else {
          this.setFrame(SHIELD_MAX_LEVEL - this.#energyLevel);
        }
      }
    })

    this.scene.add.existing(this)
  }
}
