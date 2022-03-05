import { States, SpeechBubbleConfig } from '../utils/interfaces';

export default class Oreh extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;

  public isInvincible: boolean = false;

  // private actions: string[] = ["idle","run","attack","jump"];
  private actions: string[] = ["idle","attack","jump","run","run","run"];
  private action: string;
  private states: States;
  private statesUpdate: States;

  private isAttacking: boolean = false;
  private runSpeed: number = 150;
  private turnTimer: number = 100;
  private turnTimerCounter: number = 0;

  // private jump: JumpConfig = {
  //   s: 250, h: 400,
  //   t: 0, amount: 30, counter: 0
  // };

  private jumpHeight: number = 500;
  private jumpTime: number = 300;
  private jumpCounter: number = 0;
  private jumpVelocityX: number = 400;
  private jumpVelocityY: number = -80;

  private invincibleFor: number = 3000;
  private invincibleCounter: number = 0;

  private health: number = 2;

  private response1: SpeechBubbleConfig = {
    w: 120, h: 60, minDelay: 500, maxDelay: 1500,
    quote: `Foolish man, you cannot hope to defeat me`
  };
  private response2: SpeechBubbleConfig = {
    w: 120, h: 60, minDelay: 500, maxDelay: 1500,
    quote: `Monster? Monster! You are the monster who has defiled this sacred place`
  };

  private response4: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 500, maxDelay: 5000, quote: `DIE!` };
  private stopSpeechCycle: boolean = false;

  private debugText: Phaser.GameObjects.Text;

  constructor(scene, config){
    super(scene, config.x, config.y, "cemetery-atlas", "hero-idle-1");

    scene.add.existing(this);
    scene.enemies.add(this);
    this.scene = scene;
    this.player = scene.player;
    this.action = "idle";
    this.name = "oreh";

    this.setPosition(config.x+26, config.y-34);
    this.body.setSize(22,45);
    this.body.offset.y = 15;
    this.body.setDragX(50);
    this.body.setAllowDrag(true);
    this.body.setGravityY(-500);

    this.states = this.createStateInits();
    this.statesUpdate = this.createStateUpdaters();

  	// this.animations.add('crouch', ['hero-crouch'], animVel - 8  , false);
  	// this.animations.add('hurt', ['hero-hurt'], animVel - 8  , false);
  	// this.animations.play('idle');
    scene.anims.create({
      key: "oreh-idle",
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hero-idle-",
        start: 1,
        end: 4
      }),
      frameRate: 6,
      repeat: -1
    });
    scene.anims.create({
      key: "oreh-run",
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hero-run-",
        start: 1,
        end: 6
      }),
      frameRate: 4,
      repeat: -1
    });
    scene.anims.create({
      key: "oreh-jump",
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hero-jump-",
        start: 1,
        end: 2
      }),
      frameRate: 4,
      repeat: 0
    });
    scene.anims.create({
      key: "oreh-fall",
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hero-jump-",
        start: 3,
        end: 4
      }),
      frameRate: 4,
      repeat: 0
    });
    scene.anims.create({
      key: "oreh-attack",
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hero-attack-",
        start: 1,
        end: 5
      }),
      frameRate: 4,
      repeat: 0
    });
    scene.anims.create({
      key: "oreh-hurt",
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hero-hurt-",
        start: 1,
        end: 1
      }),
      frameRate: 4,
      repeat: 0
    });

    this.play("oreh-idle");
    this.on("animationupdate", this.animUpdate, this);

    this.debugText = this.scene.add.text(this.x, this.y-50, ``, {
      fontFamily: 'Times New Roman',
      fontSize: `20`,
      color: '#ffffff',
      align: 'center'
    });
  }

  private animUpdate(animation, frame, sprite){
    if(animation.key == "oreh-attack" && frame.index == 4){
      this.body.setGravityY(-500);
      this.isAttacking = false;
    }
  }
  private createStateInits(): States {
    const run = () => {
      if(this.player.x > this.x){
        this.flipX = false;
        this.play("oreh-run");
      }else{
        this.flipX = true;
        this.play("oreh-run");
      }
    };
    const idle = () => {
      this.play("oreh-idle");
      this.body.setVelocityX(0);
    };
    const attack = () => {
      this.play("oreh-attack");
      let th = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
      this.flipX = (th > 0) ? true : false;
      this.body.setVelocity(Math.cos(th)*300, Math.sin(th)*300);
      this.body.setGravityY(-1000);
      this.isAttacking = true;
    };
    const jump = () => {
      let th = Phaser.Math.Angle.Between(this.x, this.y, this.player.x, this.player.y);
      this.body.setVelocity(Math.cos(th)*200, -this.jumpHeight);
    };
    return {run, idle, attack, jump};
  }

  private createStateUpdaters(): States{
    const run = () => {
      let speed = (this.flipX) ? -this.runSpeed : this.runSpeed;
      this.body.setVelocityX(speed);
    };
    const idle = () => {};
    const attack = () => {};
    const jump = () => {};
    return {run, idle, attack, jump};
  }

  moveUpdate(): void {
    let speed = (this.flipX) ? -this.runSpeed : this.runSpeed;
    this.body.setVelocityX(speed);
  }

  destroy(): void {
    if (this.health == 0 || !this.scene) {
      super.destroy();
      return;
    }

    this.action = `jump`;
    this.isInvincible = true;
    this.setAlpha(0.2);
    this.invincibleCounter = this.scene.time.now + this.invincibleFor;
    this.body.setVelocity( (Math.random() > 0.5) ? -200 : 200, -250);
    this.health--;
  }

  update(): void{
    this.debugText.setText(`${this.isAttacking}  ${this.action}\n${this.turnTimerCounter}`);
    this.debugText.setPosition(this.x, this.y-50);

    if (this.invincibleCounter <= this.scene.time.now) {
      this.isInvincible = false;
      this.setAlpha(1);
    }
    if(this.turnTimerCounter >= this.turnTimer) {
      this.turnTimerCounter = 0;

      // this.action = this.actions[Phaser.Math.Between(0,this.actions.length-1)];
      // if (this.isInvincible) this.action = "idle";
      this.action = (this.isInvincible) ? "idle" : this.actions[Phaser.Math.Between(0,this.actions.length-1)];

      //// TODO: this.states doesn't need to be a global array
      this.states[this.action]();
    } else {
      this.turnTimerCounter++;
      this.statesUpdate[this.action]();
    }

    if (this.isAttacking) {

      //update loop for when oreh is attacking

    } else if (this.body.onFloor()) {
      if (this.body.velocity.x == 0) {
        this.play("oreh-idle", true);
      } else {
        this.play("oreh-run", true);
      }
    } else {
      if (this.body.velocity.y > 0) {
        this.play("oreh-jump", true);
      } else {
        this.play("oreh-fall", true);
      }
    }
  }

  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    if (callerSpeech === `Have at you`
      || callerSpeech === `I shall ezeroth!`
      || callerSpeech === `By the blood of my father`)
    {
      return (this.stopSpeechCycle) ? false : this.response1;
    } else if (callerSpeech === `DIE MONSTER!!!!!`){
      this.stopSpeechCycle = true;
      return this.response2;
    } else {
      return false;
    }
  }
}
