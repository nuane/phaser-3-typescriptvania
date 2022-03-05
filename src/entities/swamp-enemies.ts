import { SpeechBubbleConfig } from '../utils/interfaces';
class SwampEnemy extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public isInvincible: boolean = true;

  private response0: SpeechBubbleConfig = { w: 100, h: 30, minDelay: 500, maxDelay: 1500, quote: `SWAMP MONSTER am I!` };
  constructor(scene, config){
    super(scene, config.x, config.y, "town-atlas");

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);

    // TODO: RESET for each enemy until physics body matches with sprite
    this.setPosition(config.x+26, config.y-34);
    this.body.setSize(23,37);
    this.body.offset.y = 10;

  }
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return this.response0;
  }
}

class Thing extends SwampEnemy {
  constructor(scene, config){
    super(scene, config);

    // this.setPosition(config.x+26, config.y-34);
    // this.body.setSize(23,37);


    scene.anims.create({
      key: "thing-walk",
      frames: scene.anims.generateFrameNames("swamp-atlas",{
        prefix: "thing",
        start: 1,
        end: 4
      }),
      frameRate: 5,
      repeat: -1,
    });

    this.play("thing-walk");
  }
}
class Spider extends SwampEnemy {
  constructor(scene, config){
    super(scene, config);

    scene.anims.create({
      key: "spider-walk",
      frames: scene.anims.generateFrameNames("swamp-atlas",{
        prefix: "spider",
        start: 1,
        end: 4
      }),
      frameRate: 5,
      repeat: -1,
      hideOnComplete: true
    });

    this.play("spider-walk");
  }
}
class SwampGhost extends SwampEnemy {
  constructor(scene, config){
    super(scene, config);

    scene.anims.create({
      key: "swamp-ghost-move",
      frames: scene.anims.generateFrameNames("swamp-atlas",{
        prefix: "Ghost",
        start: 1,
        end: 8
      }),
      frameRate: 10,
      repeat: -1,
    });

    this.play("swamp-ghost-move");
  }
}



export { Thing, Spider, SwampGhost };
