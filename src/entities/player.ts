import { State, SpeechBubbleConfig, JumpConfig, SwingConfig } from '../utils/interfaces';
import FireBall2 from './fireball2';
import SpeechBubble from '../utils/speechBubble';

// TODO: fix types, too many duplicates from old state machine logic
export default class Player extends Phaser.GameObjects.Container {
  public sprite: Phaser.GameObjects.Sprite;
  public body: Phaser.Physics.Arcade.Body;
  public name: string = 'PLAYER_1';
  public health: number = 10;
  public debugText: Phaser.GameObjects.Text;

  public actionStateUpdater: State;
  public actionName: string;

  public disableController: boolean = false;

  public isRunning: boolean = false;
  public isInvincible: boolean = false;
  public isSwinging: boolean = false;

  public action1: boolean = false; //running mechanic
  public action2: boolean = false; //jump bool
  public action3: boolean = false; //swinging mechanic



  //base acc speed
  private movementAcceleration: number;
  private accSpeed: number = 500;
  private maxWalkSpeed: number = 80;
  private maxRunSpeed: number = 350;

  private jump: JumpConfig = {
    s: 250, h: 400,
    t: 0, amount: 30, counter: 0
  };

  private swingPoint: SwingConfig;

  // TODO: UPDATE SPEEK mechanic AND DELETE
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
    quote: `Most wicked of creatures who dares speak to me tonight, you are the filth-ridden plague scorching out the sun` };

  private sounds: any; //TODO fix type any type is lazy type

  constructor(scene: Phaser.Scene, playerParams: any){
    super(scene, playerParams.x, playerParams.y);
    console.log('player constructor', playerParams);

    this.scene = scene;
    this.sounds = playerParams.audio;
    this.name = "avatar";

    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.createCharacterAnimations(scene);

    this.sprite = scene.add.sprite(0, 16, "church-atlas");
    this.sprite.on('animationcomplete', this.animComplete, this); //add callback function for animation events
    this.add(this.sprite);

    this.body.setSize(12, 44);
    this.body.offset.x = -8;
    this.body.setAllowDrag(true);
    this.body.setMaxVelocityY(600);

    this.body.setVelocity(playerParams.config.vx, playerParams.config.vy);
    this.actionStateUpdater = playerParams.config.actionUpdater;
    this.actionName = playerParams.config.actionName;

    //configuring global dynamic states
    this.swingPoint = null;

    this.debugText = scene.add.text(10, 10, 'hello');
    this.add(this.debugText);
  }

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
      frameRate: 30,
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
      frameRate: 12,
      repeat: 0
    });
    scene.anims.create({
      key: "player_punch",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "punch",
        start: 1,
        end: 6
      }),
      frameRate: 10,
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


  stateController(st: string){
    if (this.disableController) return;

    if (this.isSwinging){
      if ( (st == 'up') && this.swingPoint.dis > 50 ) this.swingPoint.dis -= 3;
      if ( (st == 'down') && this.swingPoint.dis < 250 ) this.swingPoint.dis += 3;
      if (st == 'left') this.swingPoint.vel += 0.00152801199; //pi/2056
      if (st == 'right') this.swingPoint.vel -= 0.00152801199;

      this.actionStateUpdater = this.swingUpdater;
      this.actionName = 'swing';
      return;
    }

    switch (st) {
      case 'left':
        this.moveInit(true);
        break;
      case 'right':
        this.moveInit(false);
        break;
      case 'down':
        this.crouchInit();
        break;
      case 'up':
        this.upInit();
        break;
      default:
        this.idleInit();
    }
  }
  actionInput(controls: string): string {
    //return if state doesn't change
    this.debugText.setText(controls);
    let btn = controls.split('-');
    let command = '';

    if (controls == 'X-X-X-X') {
      command = 'idle';

    //// TODO: action buttons are being pressed down
    // } else if (btn[1] == 'O'){
    // } else if (btn[2] == 'O'){
    // } else if (btn[3] == 'O'){

    //action button 1 - speak
    } else if (btn[1] == 'D'){
      this.speakInit(btn[0]);
    } else if (btn[1] == 'U'){
      this.speakEnd();
    //action button 2 - jump
    } else if (btn[2] == 'D'){
      this.jumpInit(btn[0]);
    } else if (btn[2] == 'U'){
      this.jumpEnd();
    //action button 1 - attack
    } else if (btn[3] == 'D'){
      this.attackInit(btn[0]);
    } else if (btn[3] == 'U'){
      this.attackEnd();

    //directional inputs and returned states
    } else if (btn[0] == 'left'){
      command = 'left';
    } else if (btn[0] == 'right'){
      command = 'right';
    } else if (btn[0] == 'down'){
      command = 'down';
    } else if (btn[0] == 'up'){
      command = 'up';
    }

    return command;
  }

  hurtInit(): void{
    this.disableController = true;
    this.isInvincible = true;
    this.isSwinging = false;

    this.actionStateUpdater = this.hurtUpdater;
    this.actionName = 'hurt';

    this.health--;
  }
  hurtUpdater(): void{
    if (this.body.onFloor()) {
      this.isInvincible = false;
      this.disableController = false;
    }
  }

  idleInit(): void{
    let anim = (this.body.onFloor()) ? "player_idle" : "player_fall";
    this.sprite.play(anim, true);

    this.actionStateUpdater = this.idleUpdater;
    this.actionName = 'idle';
  }

  idleUpdater(): void {
    //resets state machines
    if (this.body.onFloor() && this.sprite.anims.getName() == "player_fall") this.idleInit();
    this.body.setAccelerationX(0);
  }

  crouchInit(){
    if (!this.body.onFloor()) return;

    this.sprite.play("player_crouch", false);
    this.actionStateUpdater = this.crouchUpdater;
    this.actionName = 'crouch';
  }
  crouchUpdater(){
    this.body.setAccelerationX(0);
  }
  upInit(){
    if (!this.body.onFloor()) return;

    this.sprite.play("player_fall", false);
    this.actionStateUpdater = this.upUpdater;
    this.actionName = 'up';

    if (this.body.velocity.x != 0) this.body.setVelocityY( Math.floor(-0.6*Math.abs(this.body.velocity.x)) );
  }
  upUpdater(){
    this.body.setAccelerationX(0);
  }

  moveInit(fx: boolean = true){
    if (!this.body.onFloor()) return;

    const anim = (this.body.onFloor()) ? "player_walk" : "player_fall";
    const maxSpeed = (this.action1) ? this.maxRunSpeed : this.maxWalkSpeed;

    this.sprite.play(anim, true);
    this.sprite.flipX = fx;

    this.body.setMaxVelocityX(maxSpeed);
    this.movementAcceleration = (fx) ? -this.accSpeed : this.accSpeed;

    this.actionStateUpdater = this.moveUpdater;
    this.actionName = 'move';
  }
  moveUpdater(){
    // // DEBUG: expensive way to check every frame, can improve
    if (!this.body.onFloor() && this.sprite.anims.getName() == "player_fall") this.idleInit();
    this.body.setAccelerationX(this.movementAcceleration);
  }


  jumpUpdater() {
    if (this.scene.time.now > this.jump.t) {
      this.jumpEnd();
    } else {
      this.sprite.play("player_jump", true);
      this.body.setVelocityY(-this.jump.s);
    }
  }
  //jump init when player on ground
  jumpInit(btn: string){
    this.action2 = true;

    if (this.disableController) return;
    this.disableController = true;

    //jump logic restarted if player is grounded
    this.jump.counter--;
    if (this.jump.counter > 0){
      this.sounds.jump.play();
      this.jump.t = this.scene.time.now + this.jump.h;
    }

    // TODO: testing different jumps based on different player states
    if (!this.body.onFloor()) {
      if (btn == 'left') {
        this.body.velocity.x -= 100;
        this.sprite.flipX = true;
      } else if (btn == 'right') {
        this.body.velocity.x += 100;
        this.sprite.flipX = false;
      }
    }

    if (this.actionName == 'crouch') {
      console.log(this.body.velocity.x);
      this.body.setVelocity((this.sprite.flipX) ? -700 : 700, 0);
    } else if (this.actionName == 'up') {
      // this.body.setVelocity((actor.sprite.flipX) ? -700 : 700, 0);
    } else if (!this.body.onFloor()) {
      // this.sprite.play("player_flying_kick", true);
    }

    this.actionStateUpdater = this.jumpUpdater;
    this.actionName = 'jump';
  }
  jumpEnd(){
    this.disableController = false;
    this.action2 = false;
    this.idleInit();
  }

  attackUpdater(){
    //attack update action loop
    //add logic code if necessary for every frame called by scene update

  }
  createFireball(dx: number, dy: number): void{
    let fb = new FireBall2(this.scene, this, dx, dy);
    this.add(fb);
  }

  attackInit(btn: string) {
    this.action3 = true;

    if (this.disableController) return;
    this.disableController = true;
    this.sounds.attack.play();

    //attack params constants
    const max = 200;
    const min = 10;
    const med = 100;

    let dx = 0;
    let dy = 0;
    //crouch attack
    if (this.actionName == 'crouch') {
      this.sprite.play("player_crouch_kick", true);
      dx = (this.sprite.flipX) ? -med : med;
      dy = max;
    //up attack
    } else if (this.actionName == 'up') {
      this.body.setVelocity(0);
      this.sprite.play("player_kick", true);
      dx = (this.sprite.flipX) ? -med : med;
      dy = -max;
    //air attacks
    } else if (!this.body.onFloor()) {
      this.sprite.play("player_crouch_kick", true);
      if (btn == 'down') {
        dx = (this.sprite.flipX) ? -med : med;
        dy = med;
      } else if (btn == 'up') {
        dx = (this.sprite.flipX) ? -min : min;
        dy = -max;
      } else {
        dx = (this.sprite.flipX) ? -max : max;
      }
    //regular attack
    } else {
      this.body.setVelocity(0);
      this.body.setAccelerationX(0);
      this.sprite.play("player_punch", true);

      dx = (this.sprite.flipX) ? -max : max;
    }
    //create fireball with passed dx/dy
    this.createFireball(dx, dy);

    this.actionStateUpdater = this.attackUpdater;
    this.actionName = 'attack';
  }
  attackEnd(){
    this.swingEnd();
    this.action3 = false;
  }


  animComplete(anim, frame) {
    //reset attack after animation is complete
    if (anim.key == "player_kick" || anim.key == "player_punch" || anim.key == "player_crouch_kick") {
      this.disableController = false;
      this.idleInit();
    }
  }

  update(action: string, delta: number) {
    //update drage and jump counters
    //// TODO: these functions only need to be caled once instead of continusly
    if (this.body.onFloor()) {
      this.body.setDragX(500);
      this.jump.counter = this.jump.amount;
    } else {
      this.body.setDragX(0);
    }

    this.stateController( this.actionInput(action) ); // pass player input to state machine controller
    this.actionStateUpdater(); //state machine updater(s)

        this.debugText.setText(`${this.isSwinging} ${this.actionName}`);
  }

  //TODO refactor speak logic, and choose how mechanic works

  speakInit(btn: string) {
    let call = this.getCall();
    let speech = new SpeechBubble(this.scene, this, this.call0);

    this.action1 = true;
  }
  speakEnd(){
    this.action1 = false;
  }
  speaking(){
    //// TODO: redo speak mechanic logic into state machine
    // if (this.scene.time.now > this.callTrigger){
    //   this.setCallInQue('default');
    //   this.quedSpeechesArray.shift();
    // }
  }

  //swing called from FireBall2 destory method, if this.action3 is true
  swingInit(px: number, py: number){
    this.isSwinging = true;
    this.swingPoint = {
      ox: px, oy: py,

      angle: Phaser.Math.Angle.Between(px,py, this.x,this.y),
      dis: Phaser.Math.Distance.Between(px,py, this.x, this.y),
      vel: 0, acc: 0
    };

    this.actionStateUpdater = this.swingUpdater;
    this.actionName = 'swing';

    this.scene.add.image(this.swingPoint.ox, this.swingPoint.oy, 'gameover').setScale(0.1); // DEBUG picture to see swing point
  }
  swingEnd(){
    if (this.swingPoint == null || this.isSwinging == false) return;
    this.isSwinging = false;

    const {ox, oy, dis} = this.swingPoint;
    const px = ox + dis * Math.cos(this.swingPoint.angle);
    const py = oy + dis * Math.sin(this.swingPoint.angle);

    const tx = (px-this.x) * dis * 0.7;
    const ty = (py-this.y) * dis;

    this.body.setVelocity(tx,ty);
    this.body.setMaxVelocityX(600); //resets max velo x
    this.swingPoint = null; //resets swing point
  }

  swingUpdater(){
    if (this.swingPoint == null) return;

    const {ox, oy, dis} = this.swingPoint;
    const gravity = this.scene.physics.config.gravity.y;
    const sacc = 1/250;

    const px = ox + dis * Math.cos(this.swingPoint.angle);
    const py = oy + dis * Math.sin(this.swingPoint.angle);

    this.swingPoint.acc = sacc * Math.cos(this.swingPoint.angle);
    this.swingPoint.vel += this.swingPoint.acc;
    this.swingPoint.vel *= 0.99;
    this.swingPoint.angle += this.swingPoint.vel;

    this.setPosition(px,py);
    this.body.setVelocity(0);
  }





  //TODO automatic response, not loaded currently into physics
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return false;
  }
  //sets dialogue box for next action input. Dialogue boxes are stored as array and qued in action order,
  //so player presses speak button and the next dialogue box is called in oreder
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
    //if quadSpeechesArray empty set default call in que
    if (!!this.quedSpeechesArray && !this.quedSpeechesArray.length) this.setCallInQue("default");


    let speech = this.quedSpeechesArray[0];
    this.callTrigger = this.scene.time.now + speech.minDelay;
    return speech;
  }
  // TODO: ENDOF SPEAK mechanic





}
