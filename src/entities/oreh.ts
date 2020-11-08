import { States, SpeechBubbleConfig } from '../utils/interfaces';

export default class Oreh extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;

  private actions: string[] = ["idle","run","attack"];
  private action: string;
  private states: States;
  private statesUpdate: States;

  private runSpeed: number = 150;
  private turnTimer: number = 100;
  private turnTimerCounter: number = 0;

  private jumpTime: number = 300;
  private jumpCounter: number = 0;
  private jumpVelocityX: number = 400;
  private jumpVelocityY: number = -80;

  private response1: SpeechBubbleConfig = { w: 120, h: 60, minDelay: 500, maxDelay: 1500, quote: `Foolish man, you cannot hope to defeat me` };
  private response2: SpeechBubbleConfig = { w: 120, h: 60, minDelay: 500, maxDelay: 1500, quote: `Monster? Monster! You are the monster who has defiled this sacred place` };

  private response4: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 500, maxDelay: 5000, quote: `DIE!` };
  private stopSpeechCycle: boolean = false;

  private debug: Phaser.GameObjects.Text;

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
    this.debug = this.scene.add.text(this.x, this.y-50, `${this.action}`, {
      fontFamily: 'Times New Roman',
      fontSize: 10, color: '#ffffff',
      align: 'center'
    });
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
      this.body.setVelocity(Math.cos(th)*200, Math.sin(th)*500);
    };
    return {run, idle, attack};
  }

  private createStateUpdaters(): States{
    const run = () => {
      let speed = (this.flipX) ? -this.runSpeed : this.runSpeed;
      this.body.setVelocityX(speed);
    };
    const idle = () => {};
    const attack = () => {};
    return {run, idle, attack};
  }

  moveUpdate(): void {
    let speed = (this.flipX) ? -this.runSpeed : this.runSpeed;
    this.body.setVelocityX(speed);
  }
  update(): void{
    // this.debug.setText(`${this.action} and ${this.turnTimerCounter}`);
    // this.debug.setPosition(this.x, this.y-50);
    if(this.turnTimerCounter >= this.turnTimer) {
      this.turnTimerCounter = 0;
      this.action = this.actions[Phaser.Math.Between(0,this.actions.length-1)];
      // this.action = "idle";
      this.states[this.action]();
    } else {
      this.turnTimerCounter++;
      this.statesUpdate[this.action]();
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
