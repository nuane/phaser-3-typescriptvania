import { SpeechBubbleConfig } from '../utils/interfaces';

export default class SpeechBubble extends Phaser.GameObjects.Container {
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public actor: Phaser.GameObjects.Sprite;
  public quote: string;

  constructor(scene: any, actor: any, config: SpeechBubbleConfig){
    super(scene, actor.x, actor.y);
    scene.add.existing(this);
    scene.physics.world.enable(this);
    scene.speeches.add(this); //TODO variable from gameScene

    this.scene = scene;

    this.actor = actor;
    this.name = actor.name;

    this.body.setCircle(200);
    this.body.setAllowGravity(false);
    this.body.setOffset(-150, -150);

    this.setPosition(actor.x, actor.y-20);
    this.setActive(true);
    this.setAlpha(1);

    //w: 120, h: 60, minDelay: 500, maxDelay: 1500,
    this.quote = config.quote;

    let bubbleWidth = config.w || 120;
    let bubbleHeight = config.h || 60;


    let bubblePadding = 10;
    let arrowHeight = bubbleHeight / 4;

    let bubble = this.scene.add.graphics({ x: 0, y: 0 });
    //  Bubble shadow
    bubble.fillStyle(0x222222, 0.5);
    bubble.fillRoundedRect(6, 6, bubbleWidth, bubbleHeight, 16);
    //  Bubble color
    bubble.fillStyle(0xffffff, 1);
    //  Bubble outline line style
    bubble.lineStyle(4, 0x565656, 1);
    //  Bubble shape and outline
    bubble.strokeRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    bubble.fillRoundedRect(0, 0, bubbleWidth, bubbleHeight, 16);
    //  Calculate arrow coordinates
    let point1X = Math.floor(bubbleWidth / 7);
    let point1Y = bubbleHeight;
    let point2X = Math.floor((bubbleWidth / 7) * 2);
    let point2Y = bubbleHeight;
    let point3X = Math.floor(bubbleWidth / 7);
    let point3Y = Math.floor(bubbleHeight + arrowHeight);
    //  Bubble arrow shadow
    bubble.lineStyle(4, 0x222222, 0.5);
    bubble.lineBetween(point2X - 1, point2Y + 6, point3X + 2, point3Y);
    //  Bubble arrow fill
    bubble.fillTriangle(point1X, point1Y, point2X, point2Y, point3X, point3Y);
    bubble.lineStyle(2, 0x565656, 1);
    bubble.lineBetween(point2X, point2Y, point3X, point3Y);
    bubble.lineBetween(point1X, point1Y, point3X, point3Y);

    let content = this.scene.add.text(0, 0, this.quote, {
      fontFamily: 'Times New Roman',
      fontSize: `10`,
      color: '#000000',
      align: 'center',
      wordWrap: { width: bubbleWidth - (bubblePadding * 2) }
    });
    let bounds = content.getBounds();
    content.setPosition(bubble.x + (bubbleWidth / 2) - (bounds.width / 2), bubble.y + (bubbleHeight / 2) - (bounds.height / 2));

    this.add([bubble,content]);

    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      delay: 1000,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        this.destroy();
      }
    });
    this.scene.time.addEvent({ delay: 30, callback: () => {
      this.body.destroy();
    }, callbackScope: this });
  }

  destroySpeechBody(){
    this.scene.time.addEvent({ delay: 1, callback: () => {
      this.body.destroy();
    }, callbackScope: this });
  }

}
