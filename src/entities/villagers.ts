import { SpeechBubbleConfig } from '../utils/interfaces';
class Villager extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public isInvincible: boolean = true;

  private response0: SpeechBubbleConfig = { w: 100, h: 30, minDelay: 500, maxDelay: 1500, quote: `I am your typical villager` };
  constructor(scene, config){
    super(scene, config.x, config.y, "town-atlas");

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);

    //identical for each villager
    this.setPosition(config.x+26, config.y-34);
    this.body.setSize(23,37);
  }
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return this.response0;
  }
}

class FolkBeard extends Villager {
  constructor(scene, config){
    super(scene, config);

    this.body.offset.y = 10;

    scene.anims.create({
      key: "folkbeard-idle",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "bearded-idle-",
        start: 1,
        end: 5
      }),
      frameRate: 5,
      repeat: -1,
      hideOnComplete: true
    });
    scene.anims.create({
      key: "folkbeard-walk",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "bearded-walk-",
        start: 1,
        end: 6
      }),
      frameRate: 5,
      repeat: -1,
      hideOnComplete: true
    });

    this.play("folkbeard-idle");
  }
}
class FolkHat extends Villager {
  constructor(scene, config){
    super(scene, config);

    this.body.offset.y = 10;

    scene.anims.create({
      key: "folkhat-idle",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "hat-man-idle-",
        start: 1,
        end: 4
      }),
      frameRate: 5,
      repeat: -1,
      hideOnComplete: true
    });
    scene.anims.create({
      key: "folkhat-walk",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "hat-man-walk-",
        start: 1,
        end: 6
      }),
      frameRate: 10,
      repeat: -1,
      hideOnComplete: true
    });

    this.body.offset.y = 10;
    this.play("folkhat-idle");
  }
}
class FolkOld extends Villager {
  constructor(scene, config){
    super(scene, config);
    scene.anims.create({
      key: "oldman-dropbag",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "oldman-idle-",
        start: 1,
        end: 8
      }),
      frameRate: 10,
      // repeat: -1,
    });
    scene.anims.create({
      key: "oldman-idle",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "oldman-idle-",
        start: 7,
        end: 8
      }),
      frameRate: 2,
      repeat: -1,
    });
    scene.anims.create({
      key: "oldman-walk",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "oldman-walk-",
        start: 1,
        end: 12
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.play("oldman-idle");
  }
}

class FolkWoman extends Villager {
  constructor(scene, config){
    super(scene, config);
    scene.anims.create({
      key: "woman-idle",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "woman-idle-",
        start: 1,
        end: 7
      }),
      frameRate: 10,
      repeat: -1,
      hideOnComplete: true
    });
    scene.anims.create({
      key: "woman-walk",
      frames: scene.anims.generateFrameNames("town-atlas",{
        prefix: "woman-walk-",
        start: 1,
        end: 6
      }),
      frameRate: 10,
      repeat: -1,
      hideOnComplete: true
    });
    this.play("woman-idle");
  }
}

export { FolkBeard, FolkHat, FolkOld, FolkWoman }
