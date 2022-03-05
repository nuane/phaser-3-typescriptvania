import { SpeechBubbleConfig } from '../utils/interfaces';

export default class Angel extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;

  //// TODO: I don't ufllty understand Phaser's Tweens configuration
  private tweens: any[];
  private timeline: Phaser.Tweens.Timeline;
  private timeline1: Phaser.Tweens.Timeline;

  private debugTween: boolean = true; //for creating paths for angel to follow on tween
  private eId: number;


  // private responses: {[key: string]}: string = {
  //   "this is a test, i must confess. A one and only, kind of text!":"I fly high toward skyward demise",
  // }
  private response1: SpeechBubbleConfig = { w: 120, h: 30, minDelay: 500, maxDelay: 1500, quote: `I fly high toward skyward demise` };
  private response2: SpeechBubbleConfig = { w: 120, h: 30, minDelay: 500, maxDelay: 1500, quote: `For tonight on dine on bones-` };
  private response3: SpeechBubbleConfig = { w: 60, h: 30, minDelay: 500, maxDelay: 5000, quote: `Now DIE!` };
  private response4: SpeechBubbleConfig = { w: 30, h: 30, minDelay: 500, maxDelay: 5000, quote: `DIE!` };
  private stopSpeechCycle: boolean = false;

  constructor(scene, config){
    super(scene, config.x, config.y, "church-atlas", "angel1");

    scene.add.existing(this);
    scene.enemies.add(this);
    this.eId = config.id;
    this.name = "angel";

    this.body.setAllowGravity(false);
    this.customProps(config.properties);

    // set Size
    // this.setOrigin(0.5,0.5);
    // this.setPosition(config.x+26, config.y-34);
    this.body.setSize(13,35);
    this.body.offset.y = 50;

    scene.anims.create({
      key: "angel-fly",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "angel",
        start: 1,
        end: 8
      }),
      frameRate: 10,
      repeat: -1
    });
    scene.anims.create({
      key: "angel-attack",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "angel-attack-",
        start: 1,
        end: 3
      }),
      frameRate: 4,
      repeat: 0
    });

    //update angel with Phaser.Tween that's parsed from Tiled data
    this.play("angel-fly");
    if (this.tweens){
      for (let i = 0; i < this.tweens.length; i++){
        let tw = this.tweens[i];
        if (tw.x != undefined && typeof(tw.x) == 'number') tw.x += this.x;
        if (tw.y != undefined && typeof(tw.y) == 'number') tw.y += this.y;
      }

      this.timeline = scene.tweens.timeline({
        targets: this,
        loop: -1,
        tweens: this.tweens
      });
    }
  }


  getResponse(callerSpeech: string): SpeechBubbleConfig | boolean {
    return false;
    // if (callerSpeech === `Have at you`){
    //   return this.response4;
    //   // return this.response1;
    // } else if (callerSpeech === this.response1.quote){
    //   return this.response2;
    // } else if (callerSpeech === this.response2.quote){
    //   this.stopSpeechCycle = true;
    //   return this.response3;
    // } else {
    //   return (this.stopSpeechCycle) ? false : this.response1;
    // }
  }

  //assign custom values onto sprite gameObject from Tiled map
  //values hardcoded and typed into tyepscript
  customProps(props){
    if (props === undefined) return;
    props.forEach(prop => {
      switch (prop.name) {
        case "tweens":
          this.tweens = JSON.parse(prop.value);
          break;
        default:
      }
    });
  }

  debugTweenString(): void{
    //TODO //Used to create Tiled string
    if (this.debugTween){
      console.log(this.eId, 'tween circle: ');
      console.log(JSON.stringify(
        [
          {
            x: this.x+50,
            ease: 'Sine.easeInOut',
            duration: 2000,
            yoyo: true
          },
          {
            y: this.y-40,
            ease: 'Sine.easeOut',
            duration: 1000,
            offset: 0
          },
          {
            y: this.y,
            ease: 'Sine.easeIn',
            duration: 1000
          },
          {
            y: this.y+40,
            ease: 'Sine.easeOut',
            duration: 1000
          },
          {
            y: this.y,
            ease: 'Sine.easeIn',
            duration: 1000
          }
        ]
      ).replace(/\n/g, ''));
      console.log(this.eId, 'tween back-forth, up: ');
      console.log(JSON.stringify(
        [
          {
            x: this.x+100,
            ease: 'Sine.easeInOut',
            duration: 4000,
            yoyo: true
          },
          {
            y: this.y-40,
            ease: 'Sine.easeOut',
            duration: 1000,
            offset: 0,
            yoyo: true
          },
          {
            y: this.y+40,
            ease: 'Sine.easeIn',
            duration: 1000,
            yoyo: true
          },
          {
            y: this.y-40,
            ease: 'Sine.easeOut',
            duration: 1000,
            yoyo: true
          },
          {
            y: this.y+40,
            ease: 'Sine.easeIn',
            duration: 1000,
            yoyo: true
          }
        ]
      ));
      console.log(this.eId, 'tween square: ');
      console.log(JSON.stringify(
        [
          {
            x: this.x+100,
            y: this.y,
            ease: 'Sine.easeInOut',
            duration: 1000,
          },
          {
            x: this.x+100,
            y: this.y+100,
            ease: 'Sine.easeInOut',
            duration: 1000,
          },
          {
            x: this.x,
            y: this.y+100,
            ease: 'Sine.easeInOut',
            duration: 1000,
          },
          {
            x: this.x,
            y: this.y,
            ease: 'Sine.easeInOut',
            duration: 1000,
          }
        ]
      ));
    }
    //TODO //Used to create Tiled string
  }
}
