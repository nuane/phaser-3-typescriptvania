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
    this.load.tilemapTiledJSON("test_town", "assets/map/test_town.json");
    // this.load.tilemapTiledJSON("test3", "assets/map/test3.json");
    // this.load.tilemapTiledJSON("test4", "assets/map/test4.json");
    this.load.tilemapTiledJSON("test5", "assets/map/test5.json");
    
    // load tilesets
    this.load.image("church-tileset", "assets/tileset/church-tileset.png");
    this.load.image("cemetery-tileset", "assets/tileset/cemetery-tileset.png");
    this.load.image("cemetery-objects", "assets/tileset/cemetery-objects.png");
    this.load.image("gothic-castle-tileset", "assets/tileset/gothic-castle-tileset.png");
    this.load.image("gothic-rooftop-tileset", "assets/tileset/gothic-rooftop-tileset.png");
    this.load.image("warped-tileset", "assets/tileset/warped-tileset.png");
    this.load.image("swamp-tileset", "assets/tileset/swamp-tileset.png");
    this.load.image("swamp-objects", "assets/tileset/swamp-objects.png");
    this.load.image("town-tileset", "assets/tileset/town-tileset.png");


    this.load.image("enemies", "assets/tileset/enemy-sprites.png");
    // background image
    this.load.image("church-bg0", "assets/background/church0.png");
    this.load.image("church-bg1", "assets/background/church1.png");

    this.load.image("town-bg0", "assets/background/town-background.png");
    this.load.image("town-bg1", "assets/background/town-middleground.png");

    this.load.image("cemetery-bg0", "assets/background/cemetery-moon.png");
    this.load.image("cemetery-bg1", "assets/background/cemetery-mountains.png");
    this.load.image("cemetery-bg2", "assets/background/cemetery-graveyard.png");

    this.load.image("sunnyland-bg0", "assets/background/sunnyland-woods--clouds.png");
    this.load.image("sunnyland-bg1", "assets/background/sunnyland-woods--mountains.png");
    this.load.image("sunnyland-bg2", "assets/background/sunnyland-woods--trees.png");

    this.load.image("night-town-bg0", "assets/background/night-town-sky.png");
    this.load.image("night-town-bg1", "assets/background/night-town-clouds.png");
    this.load.image("night-town-bg2", "assets/background/night-town-mountains.png");
    this.load.image("night-town-bg2a", "assets/background/night-town-mountains-lights.png");
    this.load.image("night-town-bg3", "assets/background/night-town-far-buildings.png");
    this.load.image("night-town-bg4", "assets/background/night-town-forest.png");
    this.load.image("night-town-bg5", "assets/background/night-town-town.png");
    // atlas
    this.load.atlas("church-atlas", "assets/atlas/church.png", "assets/atlas/church.json" );
    this.load.atlas("cemetery-atlas", "assets/atlas/cemetery.png", "assets/atlas/cemetery.json" );
    this.load.atlas("town-atlas", "assets/atlas/town.png", "assets/atlas/town.json" );
    this.load.atlas("sunnyland-woods-atlas", "assets/atlas/sunnyland-woods.png", "assets/atlas/sunnyland-woods.json" );
    this.load.atlas("swamp-atlas", "assets/atlas/swamp.png", "assets/atlas/swamp.json" );
    this.load.atlas("nightmare-atlas", "assets/atlas/nightmare.png", "assets/atlas/nightmare.json" );
    this.load.atlas("skull-demon-atlas", "assets/atlas/skull-demon.png", "assets/atlas/skull-demon.json" );

    // audio
    this.load.audio("attack", "assets/sounds/attack.ogg");
    this.load.audio("hurt", "assets/sounds/hurt.ogg");
    this.load.audio("jump", "assets/sounds/jump.ogg");
    this.load.audio("kill", "assets/sounds/kill.ogg");
    this.load.audio("music", "assets/sounds/ockaie_temple.ogg");
    // title assets

    // TODO: assets used from Gothicvania pack
    this.load.image("title", "assets/image/title-screen.png");
    this.load.image("credits", "assets/image/credits-text.png");
    this.load.image("enter", "assets/image/press-enter-text.png");
    this.load.image("instructions", "assets/image/instructions.png");
    this.load.image("gameover", "assets/image/game-over.png");

    this.load.image("_", "assets/image/blank.png");

  }

  create()
  {
    this.scale.resize(640, 400); //resize game to 640x400 resolution (SNES-like)
    //opening map config TODO change for title screens and beginning
    let openingMapConfig = {
      map: 'test_town',
      x: 40,
      y: 200,
      player: {
        vx: 0,
        vy: 0,
        actionName: "idle",
        actionUpdater: null,
      }
    };
    this.scene.start("game", openingMapConfig);
  }
}
