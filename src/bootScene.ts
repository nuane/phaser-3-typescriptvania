import Bar from './entities/progressBar';
// import Bar from './progressBar';

export default class BootScene extends Phaser.Scene
{
  private bar: Bar;
  constructor ()
  {
    super('boot');
  }

  preload() {
    // loadbar
    this.bar = new Bar({ scene: this });

    // load assets
    // load tiled map
    this.load.tilemapTiledJSON("test0", "assets/map/test0.json");
    this.load.tilemapTiledJSON("test1", "assets/map/test1.json");
    this.load.tilemapTiledJSON("test2", "assets/map/test2.json");
    // load tilesets
    this.load.image("church-tileset", "assets/environment/church-tileset.png");
    this.load.image("cemetery-tileset", "assets/environment/cemetery-tileset.png");
    this.load.image("cemetery-objects", "assets/environment/cemetery-objects.png");
    this.load.image("enemies", "assets/environment/enemy-sprites.png");
    // background images
    this.load.image("church-background0", "assets/environment/church-background.png");
    this.load.image("church-background1", "assets/environment/church-columns.png");
    this.load.image("cemetery-background0", "assets/environment/cemetery-moon.png");
    this.load.image("cemetery-background1", "assets/environment/cemetery-mountains.png");
    this.load.image("cemetery-background2", "assets/environment/cemetery-graveyard.png");
    // atlas
    this.load.atlas("church-atlas", "assets/atlas/church.png", "assets/atlas/church.json" );
    this.load.atlas("cemetery-atlas", "assets/atlas/cemetery.png", "assets/atlas/cemetery.json" );
    // audio
    this.load.audio("attack", "assets/sounds/attack.ogg");
    this.load.audio("hurt", "assets/sounds/hurt.ogg");
    this.load.audio("jump", "assets/sounds/jump.ogg");
    this.load.audio("kill", "assets/sounds/kill.ogg");
    this.load.audio("music", "assets/sounds/ockaie_temple.ogg");
    // title assets
    this.load.image("title", "assets/images/title-screen.png");
    this.load.image("credits", "assets/images/credits-text.png");
    this.load.image("enter", "assets/images/press-enter-text.png");
    this.load.image("instructions", "assets/images/instructions.png");
    this.load.image("gameover", "assets/images/game-over.png");

  }

  create()
  {
    this.scale.resize(320, 240);
    let openingMapConfig = {
      map: 'test0',
      x: 40,
      y: 60
    };
    this.scene.start("game", openingMapConfig);
  }
}
