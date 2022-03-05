import { SpeechBubbleConfig } from '../utils/interfaces';
class Sunny extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public isInvincible: boolean = false;

  private response0: SpeechBubbleConfig = { w: 100, h: 30, minDelay: 500, maxDelay: 1500, quote: `We are sunny creatures` };
  constructor(scene, config){
    super(scene, config.x, config.y, "sunnyland-woods-atlas");

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);
    this.body.setSize(25,25);
  }
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return this.response0;
  }
}

class Squirrel extends Sunny{
  constructor(scene, config){
    super(scene, config);

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);
    this.body.offset.y = 23;
    this.body.offset.x = 30;

    scene.anims.create({
      key: "squirrel_idle",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "player-idle-",
        start: 1,
        end: 8
      }),
      frameRate: 4,
      repeat: -1,
    });
    scene.anims.create({
      key: "squirrel_run",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "player-run-",
        start: 1,
        end: 6
      }),
      frameRate: 7,
      repeat: -1,
    });
    scene.anims.create({
      key: "squirrel_jump",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "player-jump-",
        start: 1,
        end: 4
      }),
      frameRate: 20
    });
    scene.anims.create({
      key: "squirrel_hurt",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "player-hurt-",
        start: 1,
        end: 2
      }),
      frameRate: 12,
      repeat: -1,
    });
    scene.anims.create({
      key: "squirrel_crouch",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "player-crouch-",
        start: 1,
        end: 2
      }),
      frameRate: 12,
      repeat: -1,
    });

    this.play("squirrel_idle");
  }
}

class Grasshopper extends Sunny{
  constructor(scene, config){
    super(scene, config);

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);

    // set setSiz
    // this.body.setSize(15,21);
    this.body.offset.y = 8;
    this.body.offset.x = 10;

    scene.anims.create({
      key: "grasshopper-idle",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "grasshopper-idle-",
        start: 1,
        end: 4
      }),
      frameRate: 3,
      repeat: -1,
    });
    scene.anims.create({
      key: "grasshopper-jump",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "grasshopper-jump-",
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1,
    });
    scene.anims.create({
      key: "grasshopper-fall",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "grasshopper-fall-",
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.play("grasshopper-idle");
  }
  update(){
    // if (this.counter++ > 100 && this.body.onFloor()) {
    //     this.body.velocity.y = -260;
    //     this.counter = 0;
    //     // change direction
    //     if (this.jumpCounter++ > 2) {
    //         this.jumpCounter = 1;
    //         this.dirX = this.dirX * -1;
    //     }
    // } else if (this.body.onFloor()) {
    //     this.body.velocity.x = 0;
    //     this.animations.play("idle");
    // } else {
    //     this.body.velocity.x = 20 * this.dirX;
    //     if (this.body.velocity.y < 0) {
    //         this.animations.play("jump");
    //     } else {
    //         this.animations.play("fall");
    //     }
    // }
    // //flip
    // this.scale.x = (this.dirX == 1) ? -1 : 1;
    //TODO update code here
  }
}

class Ant extends Sunny{
  private response_ant: SpeechBubbleConfig = { w: 100, h: 30, minDelay: 500, maxDelay: 1500, quote: `I am an ant` };
  constructor(scene, config){
    super(scene, config);

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);

    this.body.offset.y = 6;
    this.body.offset.x = 12;

    // this.setPosition(config.x+26, config.y-34);
    // this.body.setSize(15,21);
    // this.body.offset.y = 29;

    // this.body.gravity.y = 500;
    // this.speed = 40;
    // this.body.velocity.x = this.speed;
    // this.body.bounce.x = 1;
    // this.kind = "ant";

    scene.anims.create({
      key: "ant-walk",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "ant-",
        start: 1,
        end: 8
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.play("ant-walk");
  }
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return this.response_ant;
  }
  update(){
    // if (this.body.velocity.x < 0) {
    //     this.scale.x = 1;
    // } else {
    //     this.scale.x = -1;
    // }
  }
  turnAround(){
    // if (this.body.velocity.x > 0) {
    //     this.body.velocity.x = -this.speed;
    //     this.x -= 5;
    // } else {
    //     this.body.velocity.x = this.speed;
    //     this.x += 5;
    // }
  }
}

class Gator extends Sunny{
  constructor(scene, config){
    super(scene, config);

    this.scene = scene;
    scene.add.existing(this);
    scene.enemies.add(this);

    this.body.offset.y = 16;
    this.body.offset.x = 10;

    // this.setPosition(config.x+26, config.y-34);
    // this.body.setSize(15,21);
    // this.body.offset.y = 29;

    // this.anchor.setTo(0.5);
    // game.physics.arcade.enable(this);
    // this.body.setSize(16, 21, 15, 20);
    // this.initX = this.x;
    // this.initY = this.y;
    // this.distance = distance;
    // this.speed = 40;
    // this.horizontal = horizontal;
    // if (this.horizontal) {
    //     this.body.velocity.x = this.speed;
    //     this.body.velocity.y = 0;
    // } else {
    //     this.body.velocity.x = 0;
    //     this.body.velocity.y = this.speed;
    // }

    scene.anims.create({
      key: "gator-fly",
      frames: scene.anims.generateFrameNames("sunnyland-woods-atlas",{
        prefix: "gator-",
        start: 1,
        end: 4
      }),
      frameRate: 10,
      repeat: -1,
    });
    this.play("gator-fly");
  }
  update(){
        // if (this.horizontal) {
        //     this.horizontalMove();
        // } else {
        //     this.verticalMove();
        // }


  }

    //TODO update or delete
    // Gator.prototype.verticalMove = function () {
    //     if (this.body.velocity.y > 0 && this.y > this.initY + this.distance) {
    //         this.body.velocity.y = -40;
    //     } else if (this.body.velocity.y < 0 && this.y < this.initY - this.distance) {
    //         this.body.velocity.y = 40;
    //     }
    //     if (this.x > player.x) {
    //         this.scale.x = 1;
    //     } else {
    //         this.scale.x = -1;
    //     }
    // }
    // Gator.prototype.horizontalMove = function () {
    //     if (this.body.velocity.x > 0 && this.x > this.initX + this.distance) {
    //         this.body.velocity.x = -40;
    //     } else if (this.body.velocity.x < 0 && this.x < this.initX - this.distance) {
    //         this.body.velocity.x = 40;
    //     }
    //     if (this.body.velocity.x < 0) {
    //         this.scale.x = 1;
    //     } else {
    //         this.scale.x = -1;
    //     }
    // }
}

export { Squirrel, Grasshopper, Ant, Gator }
