import { SpeechBubbleConfig } from '../utils/interfaces';

// import Controls from '../controls/controls'
// import PlayerSpine from './playerSpine'
// import SpeechBubble from '../utils/speechBubble'
export default class Player extends Phaser.GameObjects.Sprite {
  public body: Phaser.Physics.Arcade.Body;
  public disableSpeech: boolean = false;
  public speechCounter: number = 0;

  private speed: number = 150;
  private runSpeed: number = 225;
  private runAccelerator: number = 0;
  private jumpSpeed: number = 400;

  private walkSpeedX: number = 200;
  private runSpeedX: number = 500;
  private flySpeedX: number = 1000;

  private currentSpeedX: number = 200;
  private playerSpeedX: number = 200;
  private playerSpeedY: number = 1200;

  // private speechBubble: SpeechBubble;



  private call0: SpeechBubbleConfig = { w: 60, h: 30, minDelay: 500, maxDelay: 500, quote: `I shall ezeroth!` };
  private call1: SpeechBubbleConfig = { w: 60, h: 30, minDelay: 500, maxDelay: 500, quote: `Have at you` };
  private call2a: SpeechBubbleConfig = { w: 120, h: 30, minDelay: 500, maxDelay: 500, quote: `By the blood of my father` };
  private call2b: SpeechBubbleConfig = { w: 120, h: 30, minDelay: 1000, maxDelay: 2000, quote: `And the spirit of my mother` };
  private callTrigger: number = 0;

  private quedSpeechesArray: SpeechBubbleConfig[] = [];

  private response0: SpeechBubbleConfig = { w: 60, h: 20, minDelay: 1000, maxDelay: 5000, quote: `...` };
  private response1: SpeechBubbleConfig = { w: 120, h: 30, minDelay: 1000, maxDelay: 5000, quote: `this is a response: response1!!` };
  private response2: SpeechBubbleConfig = { w: 120, h: 30, minDelay: 500, maxDelay: 1500, quote: `DIE MONSTER!!!!!` };
  private response3: SpeechBubbleConfig = { w: 120, h: 60, minDelay: 500, maxDelay: 1500,
    quote: `Most wicked of creatures who dares speak to me tonight, you are the filthy-rotten plague destroying the system` };




  private sounds: any; //TODO fix type

  public isCrouching: boolean = false;
  public isAttacking: boolean = false;
  public isShouting: boolean = false;
  public isAirAttacking: boolean = false;
  public isHurt: boolean = false;
  public isRunning: boolean = false;
  public isJumping: boolean = false;



  constructor(scene: Phaser.Scene, playerParams: any){
    super(scene, playerParams.x, playerParams.y, "church-atlas");
    this.scene = scene;
    this.sounds = playerParams.audio;
    this.name = "avatar";

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.createCharacterAnimations(scene);


    // scene.add.sprite(playerParams.x, playerParams.y, null);
    this.play("player_idle");
    // on complete animation event
    this.on('animationcomplete', this.animComplete, this);

    // set size
    this.setOrigin(0.5, 0.5);
    this.body.setSize(12, 44);
    this.body.offset.y = 16;
    this.body.setMaxVelocity(this.playerSpeedX, this.playerSpeedY);
    this.body.setDragX(500);
    this.body.setAllowDrag(true);
  }

  create(){}
  createCharacterAnimations(scene: any){
    // playerParams animations
    scene.anims.create({
      key: "player_idle",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "idle",
        start: 1,
        end: 4
      }),
      frameRate: 3,
      repeat: -1
    });
    scene.anims.create({
      key: "player_crouch_kick",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "crouch-kick",
        start: 1,
        end: 5
      }),
      frameRate: 20,
      repeat: 0
    });
    scene.anims.create({
      key: "player_crouch",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "crouch",
        start: 1,
        end: 2
      }),
      frameRate: 20,
      repeat: 0
    });
    scene.anims.create({
      key: "player_fall",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "fall",
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: "player_flying_kick",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "flying-kick",
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: "player_hurt",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "hurt",
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: "player_jump",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "jump",
        start: 1,
        end: 2
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: "player_kick",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "kick",
        start: 1,
        end: 5
      }),
      frameRate: 6,
      repeat: 0
    });
    scene.anims.create({
      key: "player_punch",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "punch",
        start: 1,
        end: 6
      }),
      frameRate: 8,
      repeat: 0
    });
    scene.anims.create({
      key: "player_walk",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "walk",
        start: 1,
        end: 6
      }),
      frameRate: 8,
      repeat: -1
    });
  }

  //TODO automatic response, not loaded currently into physics
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {return false;}

  setCallInQue(bubble: any): void{
    let speech = bubble.quote;
    if (speech === `I fly high toward skyward demise`){
      this.quedSpeechesArray.push(this.response1);
    } else if (speech === `Monster? Monster! You are the monster who has defiled this sacred place`){

    } else if (speech === `Foolish man, you cannot hope to defeat me`){
      this.quedSpeechesArray.push(this.response2);
    } else if (speech === this.call2a.quote) {
      this.quedSpeechesArray.push(this.call2b);
    } else {
      this.setDefaultCall();
    }
  }
  setDefaultCall(): void{
    let rndCall = Phaser.Math.Between(0, 2);
    this.quedSpeechesArray = [];
    switch (rndCall) {
      case 0:
        this.quedSpeechesArray.push(this.call0);
        break;
      case 1:
        this.quedSpeechesArray.push(this.call1);
        break;
      default:
        this.quedSpeechesArray.push(this.call2a);
    }
  }
  getCall(): SpeechBubbleConfig {
    if (!!this.quedSpeechesArray && !this.quedSpeechesArray.length) this.setCallInQue("default");
    let speech = this.quedSpeechesArray[0];
    this.callTrigger = this.scene.time.now + speech.minDelay;
    this.disableSpeech = true;
    return speech;
  }

  movementBoost(){
    this.runAccelerator += 1.5;
    this.body.setVelocityX(this.body.velocity.x * 1.5);
    if (this.runAccelerator > 5) this.runAccelerator = 5; //maximize acceleration amount
    // this.attack();
  }
  moveRight() {
    if (this.isCrouching) return;
    this.flipX = false;
    this.body.setAccelerationX(600);
  }
  moveLeft() {
    if (this.isCrouching) return;
    this.flipX = true;
    this.body.setAccelerationX(-600);
  }

  //TODO old code
  __moveLeft() {
    if (this.isCrouching) return;
    // this.runAccelerator += (this.runAccelerator <= 1) ? 0.05 : (this.runAccelerator >= 1.2) ? -0.05 : 0;
    // (this.isRunning) ? this.body.setVelocityX(-this.runSpeed * this.runAccelerator) : this.body.setVelocityX(-this.speed);
    this.flipX = true;
    let maxV = 0;
    // if (this.isRunning) {
    //   this.body.setMaxVelocity(this.maxSpeedX1, this.playerSpeedY);
    //   this.body.setAccelerationX(-600);
    // } else {
    //   this.body.setMaxVelocity(this.maxSpeedX0, this.playerSpeedY);
    //   this.body.setAccelerationX(-400);
    if (this.isRunning) {
      // this.body.setMaxVelocity(this.maxSpeedX1, this.playerSpeedY);
      // this.body.setAccelerationX(600);
      maxV = 500;
    } else {
      // this.body.setMaxVelocity(this.maxSpeedX0, this.playerSpeedY);
      maxV = 300;
    }
    (this.body.velocity.x < maxV) ? this.body.setAccelerationX(-600) : this.body.setAccelerationX(0);
    // }
  }

  stopMove() {
    // this.runAccelerator = 0;
    this.body.setAccelerationX(0);
  }

  jump() {
    if (this.isCrouching){
      this.body.setVelocityY((this.flipX) ? this.body.velocity.x : -this.body.velocity.x);
      // this.body.setVelocityX((this.flipX) ? -this.maxSpeedX2 : this.maxSpeedX2);
    } else {
      this.body.setVelocityY(-this.jumpSpeed);
    }
  }
  jumpInit(){
    this.sounds.jump.play();
    this.isJumping = true;
  }
  jumpEnd(){
    this.isJumping = false;
  }

  crouch() {
    if (!this.isCrouching) {
      this.isCrouching = true;
      this.play("player_crouch", false);
    }
  }

  standUp() {
    if (this.isCrouching) {
      this.isCrouching = false;
    }
  }

  attack() {
    this.isAttacking = true;
    if (Math.random() > .5) {
      this.play("player_kick", true);
    } else {
      this.play("player_punch", true);
    }
    //TODO attack-dash has bugs alas!
    // let attackSpeed = (this.flipX) ? -200 : 200;
    this.body.setVelocityX((this.flipX) ? -400 : 400);
    // this.body.setVelocityX(attackSpeed * (this.runAccelerator+0.5));

    this.sounds.attack.play();
  }

  airAttack() {
    this.isAirAttacking = true;
    this.play("player_flying_kick", true);
    // this.body.velocity.x *= 1.5;
    this.sounds.attack.play();
  }

  crouchAttack() {
    this.isAttacking = true;
    this.body.velocity.x = 0;
    this.play("player_crouch_kick", true);
    this.sounds.attack.play();
  }
  animComplete(anim, frame) {
    // reset flags when the animations complete

    if (anim.key == "player_kick" || anim.key == "player_punch" || anim.key == "player_crouch_kick") {
      this.isAttacking = false;
    }
  }
  animationsManager() {

    if (this.isHurt  ) {
      this.play("player_hurt", true);
      return;
    }

    if (this.isAttacking || this.isAirAttacking || this.isCrouching ) {
      return;
    }


    if (this.body.onFloor()) {
      if (this.body.velocity.x == 0) {
        this.play("player_idle", true);
      } else {
        this.play("player_walk", true);
      }
    } else {
      if (this.body.velocity.y > 0) {
        this.play("player_fall", true);
      } else {
        this.play("player_jump", true);
      }
    }
  }


  update() {
    this.animationsManager();

    // reset hurt
    if(this.isHurt && this.body.onFloor()){
        this.isHurt = false;
    }
    if (this.scene.time.now > this.callTrigger && this.disableSpeech){
      this.speechCounter++;
      this.setCallInQue('default');
      this.disableSpeech = false;
      this.quedSpeechesArray.shift();
    }
    if (this.isRunning){
      this.playerSpeedX = this.runSpeedX;
    } else {
      this.playerSpeedX = this.walkSpeedX;
    }
    
    if (this.currentSpeedX != this.playerSpeedX) {
      let increment = 5;
      this.currentSpeedX += (this.currentSpeedX > this.playerSpeedX) ? -increment : increment;
      this.body.setMaxVelocity(this.currentSpeedX, this.playerSpeedY);
    }

  }
}
