import { States, SpeechBubbleConfig } from '../utils/interfaces';

export default class Ghost extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;
  public name: string = 'ghost';

  private VTween: Phaser.Tweens.Tween;

  private xDir: number = -1;
  private speed: number = 90;
  private turnTimerTrigger: number = 200;
  private turnTimer: number = 200;

  private response1: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 100, maxDelay: 200, quote: `...` };

  constructor(scene, config) {
    super(scene, config.x, config.y, "cemetery-atlas", "ghost-halo-1");
    this.scene = scene;
    this.player = scene.player;

    scene.add.existing(this);
    scene.enemies.add(this);

    this.body.setAllowGravity(false);

    // set Size
    this.setPosition(config.x+26, config.y-34);
    this.body.setSize(14,33);
    scene.anims.create({
      key: `${this.name}_float`,
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "ghost-halo-",
        start: 1,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });
    this.play("ghost_float");

    this.VTween = scene.tweens.add({
      targets: this,
      x: config.x+50,
      y: config.y+50,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }

  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    console.log(callerSpeech);
    if (this.response1.quote === `...`){
      return false;
    } else {
      return this.response1;
    }
  }

  update(){
  	if(this.x > this.player.x) {
  		this.flipX = true;
  	} else {
  		this.flipX = false;
  	}
  }

}
