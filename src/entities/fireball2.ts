//TODO place in new file
export default class FireBall2 extends Phaser.GameObjects.Sprite{
  public body: Phaser.Physics.Arcade.Body;

  public actor: any;
  public speed: number;
  public life: number;

  private destroyCounter: number = 0;

  constructor(scene, actor, dx, dy){
    // super(scene, actor.x, actor.y, "church-atlas", "fireball1");
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
      frameRate: 5,
      repeat: -1
    });

    this.play("fireball");
    this.life = 20;

    this.setPosition((actor.sprite.flipX) ? -20 : 20, 20);
    this.body.setVelocity(dx, dy);
  }
  update(): void {
    if (this.destroyCounter++ > this.life && this.active){
      this.destroy();
    }
  }
  callSwingAction(): void{
    if (this.actor.action3) {
      this.actor.swingInit(this.actor.x + this.x, this.actor.y + this.y);
      this.destroy();
    }
  }
  // destroy(): void{
  //   if (this.actor.action3) this.actor.swingInit(this.actor.x + this.x, this.actor.y + this.y);
  //   super.destroy();
  // }
}
