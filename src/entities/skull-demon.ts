import { SpeechBubbleConfig } from '../utils/interfaces';

export default class SkullDemon extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public name: string = "skull-demon";
  public player: Phaser.GameObjects.Sprite;

  public state: number = 0;
  public isInvincible: boolean = false;

  private response1: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 100, maxDelay: 200, quote: `...` };

  private breathCounter: number = 0;
  private breathTimer: number = 1500;

  constructor(scene,x,y,player) {
    super(scene, x, y, "skull-demon");
    this.scene = scene;
    this.player = player

    scene.add.existing(this);
    scene.enemies.add(this);
    this.body.setAllowGravity(false);

    scene.anims.create({
      key: `skull-demon-idle`,
      frames: scene.anims.generateFrameNames("skull-demon-atlas", {
        prefix: "demon-idle",
        start: 1,
        end: 6
      }),
      frameRate: 4,
      repeat: -1,
    });
    scene.anims.create({
      key: `skull-demon-attack`,
      frames: scene.anims.generateFrameNames("skull-demon-atlas", {
        prefix: "demon-attack",
        start: 1,
        end: 6
      }),
      frameRate: 8,
      // repeat: 1
    });
    scene.anims.create({
      key: `skull-demon-breath`,
      frames: scene.anims.generateFrameNames("skull-demon-atlas", {
        prefix: "demon-breath",
        start: 1,
        end: 2
      }),
      frameRate: 4,
      repeat: -1,
    });

    this.body.setSize(72,72);
    this.body.offset.x = 30;
    this.body.offset.y = 44;
    this.play("skull-demon-idle");

    this.on('animationcomplete', this.animComplete, this);

    this.breathCounter = this.breathTimer;
    this.state = 0;
  }

  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    if (this.response1.quote === `...`){
      return false;
    } else {
      return this.response1;
    }
  }

  private animComplete(animation, frame, sprite){
    if(animation.key == "skull-demon-attack"){
      this.play("skull-demon-breath");
      this.state = 2;
      this.breathCounter = this.scene.time.now + 600;
      let firebreath = new FireBreath(this.scene, this);
    }
  }

  update(): void{
    // TODO: add update logic here
    if(this.scene.time.now > this.breathCounter){
      if (this.state == 0) {
        this.state = 1;
        this.play("skull-demon-attack");

        this.body.offset.x = 60;
        this.body.offset.y = 84;
        this.setPosition(this.x-14,this.y-26);
      } else if (this.state == 2) {
        this.state = 0;
        this.breathCounter = this.scene.time.now + 1500;
        //offset sprite back to idle positioning
        this.play("skull-demon-idle");

        this.body.offset.x = 30;
        this.body.offset.y = 44;
        this.setPosition(this.x+14,this.y+26);
      }
    }
  }
}




//class FireBreat exclusive to skull-demon enemy
class FireBreath extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public life: number;
  public actor: any;

  constructor(scene, actor){
    super(scene, 0, 0, "skull-demon-atlas");
    this.scene = scene;
    this.actor = actor;
    scene.add.existing(this);
    scene.projectiles.add(this); //TODO variable from gameScene
    this.body.setAllowGravity(false);

    // set setSize
    let px = (actor.flipX) ? 85 : -85;

    this.setOrigin(0.5, 0.5);
    this.setPosition(actor.x + px, actor.y + 55);
    this.body.setSize(72,72, true);

    scene.anims.create({
      key: "breath-red",
      frames: scene.anims.generateFrameNames("skull-demon-atlas", {
        prefix: "breath-red",
        start: 1,
        end: 5
      }),
      frameRate: 20,
      repeat: -1
    });
    scene.anims.create({
      key: "breath-blue",
      frames: scene.anims.generateFrameNames("skull-demon-atlas", {
        prefix: "breath-blue",
        start: 1,
        end: 5
      }),
      frameRate: 20,
      repeat: -1
    });

    this.play("breath-red");
    this.life = this.scene.time.now + 600;
  }
  update(): void{
    if(this.scene.time.now > this.life){
      this.destroy();
    }
  }
}
