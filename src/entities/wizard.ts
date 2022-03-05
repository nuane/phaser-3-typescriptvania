export default class Wizard extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;

  private castTimes: number[] = [80, 80, 180];
  private castCounterA: number = 0;
  private castCounterB: number = 0;
  private castSpeed: number = 80;
  private castAliveFor: number = 400;

  constructor(scene, config){
    super(scene, config.x, config.y, "church-atlas", "wizard-idle-1");
    this.scene = scene;
    this.player = scene.player;

    scene.add.existing(this);
    scene.enemies.add(this);
    this.customProps(config.properties);

    // set setSize
    this.setPosition(config.x+26, config.y-34);
    this.body.setSize(23,37);
    this.body.offset.y = 29;

    scene.anims.create({
      key: "wizard_idle",
      frames: scene.anims.generateFrameNames("church-atlas",{
          prefix: "wizard-idle-",
          start: 1,
          end: 5
      }),
      frameRate: 10,
      repeat: -1
    });

    scene.anims.create({
      key: "wizard_fire",
      frames: scene.anims.generateFrameNames("church-atlas",{
          prefix: "fire",
          start: 1,
          end: 10
      }),
      frameRate: 10,
      repeat: 0
    });

    this.play("wizard_idle");
    this.on('animationcomplete', this.animComplete, this);
    this.on("animationupdate", this.animUpdate, this);

    this.flipX = true;

  }

  public getResponse(callerSpeech: string) {
    return false;
  }

  private customProps(props){
    if (props === undefined) return;
    props.forEach(prop => {
      switch (prop.name) {
        case "castTimes":
          this.castTimes = prop.value.split(",").map(Number);
          break;
        case "castSpeed":
          this.castSpeed = prop.value;
          break;
        case "castAliveFor":
          this.castAliveFor = prop.value;
          break;
        default:
      }
    });
  }

  private animUpdate(animation, frame, sprite){
    if(animation.key == "wizard_fire" && frame.index == 7){
       let fireball = new FireBall(this.scene, this);
    }
  }

  private animComplete(animation, frame, sprite){
    if(animation.key == "wizard_fire"){
       this.play("wizard_idle");
    }
  }

  update(): void{
    // flip
    if(this.player.x > this.x){
      this.flipX = true;
    }else{
      this.flipX = false;
    }

    // cast fireball
    if(this.castCounterA++ > this.castTimes[this.castCounterB]){
      this.castCounterA = 0;
      //iterate through attack rhythm (castTimes<Array>)
      if (this.castCounterB++ >= this.castTimes.length-1) this.castCounterB = 0;
      this.play("wizard_fire");
    }
  }
}

class FireBall extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;
  public speed: number;
  public aliveFor: number;

  private destroyCounter: number = 0;

  constructor(scene, actor){
    super(scene, actor.x, actor.y, "church-atlas", "fireball1");
    this.scene = scene;
    scene.add.existing(this);
    scene.projectiles.add(this); //TODO variable from gameScene
    this.body.setAllowGravity(false);

    // set setSize
    this.setOrigin(0.5, 0.5);
    this.body.setSize(24,12, true);

    scene.anims.create({
      key: "fireball",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "fireball",
        start: 1,
        end: 3
      }),
      frameRate: 20,
      repeat: -1
    });

    this.play("fireball");

    this.speed = actor.castSpeed;
    this.aliveFor = actor.castAliveFor;

    if(actor.flipX){
      this.x += 38;
      this.body.velocity.x = this.speed ;
    }else{
      this.x -= 38;
      this.body.velocity.x = -this.speed ;
    }


  }
  update(): void{
    if(this.destroyCounter++ > this.aliveFor){
      this.destroy();
    }
  }
}
