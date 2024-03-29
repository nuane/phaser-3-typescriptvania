import { States, SpeechBubbleConfig } from '../utils/interfaces';

export default class Skeleton extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public name: string = "skeleton";
  public player: Phaser.GameObjects.Sprite;

  private speed: number = 0;
  private activeSpeed: number = 60;
  private spawnBehind: number;
  private spawnDistance: number;
  private spawnLocation: number;

  private response1: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 100, maxDelay: 200, quote: `...` };

  constructor(scene,x,y,player) {
    super(scene, x, y, "cemetery-atlas", "skeleton-clothed-1");
    this.scene = scene;
    this.player = player

    scene.add.existing(this);
    scene.enemies.add(this);

    this.setPosition(x+26, y-34);
    this.setActive(false);
    this.body.setAllowGravity(false);

    //add spawning and state logic
    this.spawnBehind = (Math.random() > 0.5) ? 1 : -1;
    this.spawnDistance = Math.random() * 140 + 40;
    this.spawnLocation =  this.spawnDistance * this.spawnBehind;

    this.state = 'sleeping'; //value default 0 in Phaser.GameObjects.Sprite

    scene.anims.create({
      key: `${this.name}_sleeping`,
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "skeleton-rise-clothed-",
        start: 1,
        end: 1
      }),
      frameRate: 1,
      repeat: -1,
    });
    scene.anims.create({
      key: `${this.name}_rise`,
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "skeleton-rise-clothed-",
        start: 1,
        end: 6
      }),
      frameRate: 4,
      repeat: 0,
    });
    scene.anims.create({
      key: `${this.name}_walk`,
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "skeleton-clothed-",
        start: 1,
        end: 8
      }),
      frameRate: 7,
      repeat: -1,
    });

    this.play("skeleton_sleeping");
    this.on('animationcomplete', (anim, frame) => {
      if (anim.key === "skeleton_rise"){
        this.state = 0;
        this.speed = this.activeSpeed * this.spawnBehind;
        this.play("skeleton_walk");
      }
    }, this);

    //TODO og code has audio playback for rise animation
    // this.audioRise = game.add.audio("rise");
    // this.audioRise.play();

  }
  private activateSkeleton(): void{
    // set Size
    this.setOrigin(0.5,0.5);
    this.body.setSize(18,33);
    this.body.offset.y = 19;
    this.body.setAllowGravity(true);

    this.setActive(true);
    this.play("skeleton_rise");
    this.flipX = (this.spawnBehind == 1) ? true : false;
    this.state = 'rising';
  }

  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    if (this.response1.quote === `...`){
      return false;
    } else {
      return this.response1;
    }
  }
  
  update(): void{
    //spawn in behind or in front
    if (this.state === 'sleeping' && this.player.x > this.x + this.spawnLocation) this.activateSkeleton();

    this.body.setVelocityX(this.speed);

    // turn around on touching walls
    if(this.body.onWall()){
      this.speed *= -1;
      if(this.flipX){
        this.flipX = false;
        this.x -= 5;
      }else{
        this.flipX = true;
        this.x += 5;
      }
    }
  }

}
