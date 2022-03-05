import { SpeechBubbleConfig } from '../utils/interfaces';

export default class Nightmare extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;
  public name: string = "nightmare";

  private health: number = 3;
  private isInvincible: boolean = false;
  private invincibleFor: number = 1500;
  private invincibleCounter: number = 0;

  private response1: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 100, maxDelay: 200, quote: `...` };
  private debug: Phaser.GameObjects.Text;

  constructor(scene,x,y,player) {
    super(scene, x, y, "nightmare-atlas");
    this.scene = scene;
    this.player = player

    scene.add.existing(this);
    scene.enemies.add(this);

    scene.anims.create({
      key: `nightmare-idle`,
      frames: scene.anims.generateFrameNames("nightmare-atlas", {
        prefix: "idle",
        start: 1,
        end: 4
      }),
      frameRate: 4,
      repeat: -1,
    });
    scene.anims.create({
      key: `nightmare-run`,
      frames: scene.anims.generateFrameNames("nightmare-atlas", {
        prefix: "run",
        start: 1,
        end: 4
      }),
      frameRate: 4,
      repeat: -1,
    });
    this.body.setSize(88,70);
    this.body.offset.x = 10;
    this.body.offset.y = 26;

    this.play("nightmare-idle");
    // this.on('animationcomplete', (anim, frame) => {}, this);
  }

  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    if (this.response1.quote === `...`){
      return false;
    } else {
      return this.response1;
    }
  }

  destroy(): void{
    this.health--;
    if (!this.isInvincible) {
      this.isInvincible = true;
      this.invincibleCounter = this.scene.time.now + this.invincibleFor;
      this.setAlpha(0.2);
    }
    if (this.health < 0) {
      super.destroy();
    }
  }

  update(): void{
    // TODO: add update logic here
    if (this.invincibleCounter <= this.scene.time.now) {
      this.isInvincible = false;
      this.setAlpha(1);
    }
    if (this.isInvincible) return;
  }

}
