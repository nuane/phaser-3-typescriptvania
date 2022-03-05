import { SpeechBubbleConfig } from '../utils/interfaces';

export default class HellGato extends Phaser.GameObjects.Sprite{
  body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public name: string = "hell_gato";

  private xDir: number = -1;
  private speed: number = -50;
  private turnTimerTrigger: number = 50;
  private turnTimer: number = 0;

  private response1: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 100, maxDelay: 200, quote: `...` };

  constructor(scene,x,y){
    super(scene, x, y, "cemetery-atlas", "hell-gato-1");

    scene.add.existing(this);
    scene.enemies.add(this);

    // set Size
    this.setPosition(x+26, y-34);
    this.body.setSize(55, 21);
    this.body.offset.y = 29;

    scene.anims.create({
      key: `${this.name}_run`,
      frames: scene.anims.generateFrameNames("cemetery-atlas", {
        prefix: "hell-gato-",
        start: 1,
        end: 4
      }),
      frameRate: 10,
      repeat: -1
    });

    this.play("hell_gato_run");
  }

  update(): void{
    this.body.setVelocityX(this.speed);

    // turn around
    if(this.turnTimer >= this.turnTimerTrigger){
      this.turnTimer = 0;
      this.speed *= -1;
      this.flipX = (this.flipX) ? false : true;
    }else{
      this.turnTimer++;
    }
  }
  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return false;
  }
}
