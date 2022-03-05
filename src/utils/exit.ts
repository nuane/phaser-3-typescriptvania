export default class Exit extends Phaser.GameObjects.Image{
  body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;

  private properties: any;
  // private exitTo: any;

  constructor(scene, params){
    super(scene, params.x, params.y, "church-atlas", "burning-ghoul1");

    scene.add.existing(this);
    scene.exits.add(this);

    // set Size
    this.setAlpha(0);
    this.setPosition(params.x + params.width/2, params.y + params.height/2);
    this.body.setAllowGravity(false);
    this.body.setSize(params.width, params.height);
    let ev = params.properties.map(p => p.value);
    this.properties = {x: ev[1], y: ev[2], map: ev[0]};
  }
}
