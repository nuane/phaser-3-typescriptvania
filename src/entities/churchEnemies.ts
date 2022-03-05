import { SpeechBubbleConfig } from '../utils/interfaces';

export default class churchEnemies extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;

  private response1: SpeechBubbleConfig = { w: 100, h: 40, minDelay: 100, maxDelay: 200, quote: `Death Incarniate` };

  constructor(scene, config){
    // super(scene, config.x, config.y, "church-atlas", "wizard-idle-1");
    super(scene, config.x, config.y, "church-atlas");
    this.scene = scene;
    this.player = scene.player;

    scene.add.existing(this);
    scene.enemies.add(this);

    this.flipX = true;
  }

  public getResponse(callerSpeech: string) {
    return false;
  }

  public update(): void{}
}
