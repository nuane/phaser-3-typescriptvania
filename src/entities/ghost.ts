import { SpeechBubbleConfig } from '../utils/interfaces';

export default class Ghost extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;
  public name: string = 'ghost';

  public acc: number = 30;

  private isInvincible: boolean = false;
  private invincibleFor: number = 1500;
  private invincibleCounter: number = 0;

  // private VTween: Phaser.Tweens.Tween;
  private response1: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 100, maxDelay: 200, quote: `Death Incarniate` };

  constructor(scene, config) {
    super(scene, config.x, config.y, "cemetery-atlas", "ghost-halo-1");
    this.scene = scene;
    this.player = scene.player;

    scene.add.existing(this);
    scene.enemies.add(this);

    this.body.setAllowGravity(false);
    this.body.setSize(14,33);
    this.body.setMaxVelocity(100, 100);

    scene.anims.create({
      key: `${this.name}_float`,
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "ghost-halo-",
        start: 1,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    });
    this.play("ghost_float");
  }

  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    if (this.response1.quote === `...`){
      return false;
    } else {
      // return this.response1;
      return false;
    }
  }
  destroy(): void{
    if (!this.isInvincible) {
      this.isInvincible = true;
      this.invincibleCounter = this.scene.time.now + this.invincibleFor;
    }
  }

  update(){

    let acceleration = this.acc;
    if (this.isInvincible) {
      acceleration *= -1;
      if (this.invincibleCounter <= this.scene.time.now) {
        this.isInvincible = false;
      }
    }

  	if(this.x > this.player.x) {
      this.body.setAccelerationX(-acceleration);
  		this.flipX = true;
  	} else {
      this.body.setAccelerationX(acceleration);
  		this.flipX = false;
  	}

    if(this.y > this.player.y) {
      this.body.setAccelerationY(-acceleration);
  	} else {
      this.body.setAccelerationY(acceleration);
  	}
  }

}
