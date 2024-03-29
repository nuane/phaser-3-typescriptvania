export default class BurningGhoul extends Phaser.GameObjects.Sprite{
  body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;

  private speed: number = -100;

  constructor(scene, x, y){
    super(scene, x, y, "church-atlas", "burning-ghoul1");

    scene.add.existing(this);
    scene.enemies.add(this);

    // set setSize
    this.setPosition(x+26, y-34);
    this.body.setSize(13,41);
    this.body.offset.y = 19;


    scene.anims.create({
      key: "run",
      frames: scene.anims.generateFrameNames("church-atlas", {
        prefix: "burning-ghoul",
        start: 1,
        end: 8
      }),
      frameRate: 15,
      repeat: -1
    });

    this.play("run");
  }

  update(){

    // change velocity
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
