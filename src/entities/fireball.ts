//TODO place in new file
export default class FireBall extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;

  public actor: any;
  public speed: number;
  public aliveFor: number;

  private destroyCounter: number = 0;

  constructor(scene, actor){
    // super(scene, actor.x, actor.y, "church-atlas", "fireball1");
    console.log('herere!');
    super(scene, 0, 0, "church-atlas", "fireball1");
    scene.add.existing(this);
    scene.playerProjectiles.add(this); //TODO variable from gameScene

    this.scene = scene;
    this.actor = actor;

    this.body.setAllowGravity(false);
    scene.events.on('update', this.update, this);

    // set setSize
    this.setOrigin(0.5, 0.5);
    this.body.setSize(12,12, true);

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

    this.speed = actor.castSpeed || 400;
    this.aliveFor = actor.castAliveFor || 15;

    this.setPosition((actor.sprite.flipX) ? -20 : 20, 20);
    (actor.sprite.flipX) ? this.body.setVelocityX(-this.speed) : this.body.setVelocityX(this.speed);
  }
  update(): void{
    if(this.destroyCounter++ > this.aliveFor && this.active){
      this.destroy();
    }
  }

}
