//import Moralis node-module to connect to server
import Moralis from 'moralis/dist/moralis.min.js';


import Player from './entities/player';
//enemies from church Gothicvania
import EnemyDeath from './entities/enemyDeath';
import Wizard from './entities/wizard';
import BurningGhoul from './entities/burning-ghoul';
import Angel from './entities/angel';
//enemies from cemetery Gothicvania
import HellGato from './entities/hell-gato';
import Ghost from './entities/ghost';
import Skeleton from './entities/skeleton';
import Oreh from './entities/oreh';
import Nightmare from './entities/nightmare';
import SkullDemon from './entities/skull-demon';

import { FolkBeard, FolkHat, FolkOld, FolkWoman } from './entities/villagers';
import { Squirrel, Ant, Grasshopper, Gator } from './entities/sunnyland-enemies';
import { Thing, Spider, SwampGhost } from './entities/swamp-enemies';

import SpeechBubble from './utils/speechBubble';
import Exit from './utils/exit';


export default class GameScene extends Phaser.Scene
{
  backgrounds: Phaser.GameObjects.TileSprite[];
  mapThreshold: number;
  playerAudio: any;
  music: Phaser.Sound.BaseSound;

  projectiles: Phaser.GameObjects.Group;
  playerProjectiles: Phaser.GameObjects.Group;
  speeches: Phaser.GameObjects.Group;
  playerSpeeches: Phaser.GameObjects.Group;
  enemies: Phaser.Physics.Arcade.Group;
  exits: Phaser.Physics.Arcade.Group;
  player: Player;

  physicObjects: Phaser.Physics.Arcade.Group;

  map: Phaser.Tilemaps.Tilemap;
  mainLayer: Phaser.Tilemaps.TilemapLayer;
  backLayer: Phaser.Tilemaps.TilemapLayer;
  enemyLayer: Phaser.Tilemaps.ObjectLayer;

  keyRight: Phaser.Input.Keyboard.Key;
  keyLeft: Phaser.Input.Keyboard.Key;
  keyDown: Phaser.Input.Keyboard.Key;
  keyUp: Phaser.Input.Keyboard.Key;

  keyA: Phaser.Input.Keyboard.Key;
  keyB: Phaser.Input.Keyboard.Key;
  keyC: Phaser.Input.Keyboard.Key;

  keyQ: Phaser.Input.Keyboard.Key;
  keyW: Phaser.Input.Keyboard.Key;
  keyE: Phaser.Input.Keyboard.Key;
  keyR: Phaser.Input.Keyboard.Key;

  constructor ()
  {
    const config = {
      key: 'game',
      physics: {
        arcade: {
          gravity: { y: 1000 },
          debug: true,
          debugShowVelocity: true
        }
      }
    }
    super(config);
  }

  create(sceneParams: any): void {
    console.log('game scene parameters', sceneParams);

    //create map object
    this.mapThreshold = 200;
    this.physicObjects = this.physics.add.group(); //special map tiles

    this.map = this.make.tilemap({
      key: sceneParams.map,
      tileWidth: 16,
      tileHeight: 16
    });
    //tilesprite bg
    this.backgrounds = this.createTileSpriteBG({
      width: this.sys.canvas.width,
      height: this.sys.canvas.height
    }, this.map.properties);


    //populate tiled map from json
    this.createTileMap();
    this.bindKeys();

    // create audios
    //TODO move individual sound audios to sprite class
    // --playerAudio is just passed as params to player class
    this.playerAudio = {
      attack: this.sound.add("attack"),
      hurt: this.sound.add("hurt"),
      jump: this.sound.add("jump"),
      kill: this.sound.add("kill"),
    };
    this.music = this.sound.add("music", {loop: true, volume: 0.5});
    // this.music.play(); // TODO: uncomment to hear music

    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.speeches = this.physics.add.group();

    this.playerProjectiles = this.physics.add.group();
    this.playerSpeeches = this.physics.add.group();

    this.exits = this.physics.add.group();

    this.player = new Player(this, {
      x: sceneParams.x, y: sceneParams.y, audio: this.playerAudio,
      config: sceneParams.player
    });
    this.populateEnemies();

    this.input.enabled = true;
    // camera
    this.cameras.main.setBounds(32, 32, this.map.widthInPixels-64, this.map.heightInPixels-32);
    this.cameras.main.startFollow(this.player);

    // physics
    this.physics.add.collider(this.mainLayer, this.player);
    this.physics.add.collider(this.mainLayer, this.enemies);

    this.physics.add.overlap(this.player, this.physicObjects, this.specialTileCollision, null, this);
    this.physics.add.overlap(this.enemies, this.physicObjects, this.specialTileCollision, null, this);
    // overlaps
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.player, this.projectiles, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.player, this.speeches, this.respondToCall, null, this);
    this.physics.add.overlap(this.player, this.exits, this.exitTo, null, this);

    // this.physics.add.overlap(this.enemies, this.playerSpeeches, this.respondToCall, null, this);
    this.physics.add.overlap(this.enemies, this.speeches, this.respondToCall, null, this);
    this.physics.add.overlap(this.enemies, this.playerProjectiles, this.hurtEnemy, null, this);
  }
  // TODO: move switch into seperate class file
  private populateEnemies(): void{
    this.enemyLayer.objects.forEach(enemy => {
      switch (enemy.name) {
        // TODO: params different thant other enem classes
        case "burning-ghoul":
          let ghoul = new BurningGhoul(this, enemy.x, enemy.y);
          break;
        case "skeleton":
          let skeleton = new Skeleton(this, enemy.x, enemy.y, this.player);
          break;
        case "nightmare":
          let nightmare = new Nightmare(this, enemy.x, enemy.y, this.player);
          break;
        case "skull-demon":
          let skullDemon = new SkullDemon(this, enemy.x, enemy.y, this.player);
          break;
        case "helo-gato":
          let hellgato = new HellGato(this, enemy.x, enemy.y);
          break;

        case "angel":
          let angel = new Angel(this, enemy);
          break;
        case "wizard":
          let wizard = new Wizard(this, enemy);
          break;
        case "ghost":
          let ghost = new Ghost(this, enemy);
          break;
        case "oreh":
          let oreh = new Oreh(this, enemy);
          break;
        case "folkbeard":
          let folkbeard = new FolkBeard(this, enemy);
          break;
        case "folkhat":
          let folkhat = new FolkHat(this, enemy);
          break;
        case "folkold":
          let folkold = new FolkOld(this, enemy);
          break;
        case "squirrel":
          let squirrel = new Squirrel(this, enemy);
          break;
        case "ant":
          let ant = new Ant(this, enemy);
          break;
        case "grasshopper":
          let grasshopper = new Grasshopper(this, enemy);
          break;
        case "gator":
          let gator = new Gator(this, enemy);
          break;
        case "exit":
          let exit = new Exit(this, enemy);
          break;
        default:
      }
    });
  }



  // TODO: call/response mechanic not well designed and too buggy
  respondToCall(responder, bubble){
    // console.log('responder name: ', responder, responder.name);
    if (responder.name === bubble.name) return;

    //either returns SpeechBubbleConfig or false
    let response = responder.getResponse(bubble.quote);
    bubble.destroySpeechBody();
    //if actor has response
    if (response) {
      const rDelay = Phaser.Math.Between(response.minDelay, response.maxDelay);
      const rCallback = () => this.speeches.add(new SpeechBubble(this, responder, response));
      this.time.addEvent({ delay: rDelay, callback: rCallback, callbackScope: this });
    }
  }
  //sets a determined call into a que, so player responds to certain dialogue in a certain time frame
  queNextCall(player, bubble){
    if (player.name === bubble.name) return;
    player.setCallInQue(bubble);
  }





  //loads exit dynamically, so if exit prop is undefined, uses current player position x/y
  //// DEBUG: INPUT GET DISABLED WHEN ENTERING NEXT SCENE
  exitTo(player, exit){
    //save player velocity and state, so next scene transitions better
    let playerConfig = {
      vx: this.player.body.velocity.x,
      vy: this.player.body.velocity.y,
      actionName: this.player.actionName,
      actionUpdater: this.player.actionStateUpdater,
    };

    let sceneConfig = {
      map: exit.properties.map,
      x: (exit.properties.x > 0) ? exit.properties.x : Math.floor(this.player.x) - exit.properties.x,
      y: (exit.properties.y > 0) ? exit.properties.y : Math.floor(this.player.y) - exit.properties.y,
      player: playerConfig
    }
    this.scene.start('game', sceneConfig);
  }

  hurtEnemy(enemy, projectile) {
    if (enemy.isInvincible) return;

    if (enemy.name == 'angel' || enemy.name == 'skull-demon') {
      projectile.callSwingAction();
      return;
    }

    let temp = new EnemyDeath(this, enemy.x, enemy.y);
    enemy.body.setVelocity(projectile.body.velocity.x*0.3,-30);
    enemy.destroy();
  }

  hurtPlayer(player, enemy){
    if (player.actionName == 'hurt' || !enemy.active) return;

    player.body.setVelocity( (player.x > enemy.x) ? 300 : -300, -350);
    player.body.setMaxVelocityX(500);
    player.hurtInit();
    // this.audioHurt.play();
  }

  private createTileSpriteBG(config, props): Phaser.GameObjects.TileSprite[] {
    let backgrounds = [];
    for (let i in props) {
      let bg = this.add.tileSprite(0, 0, config.width, config.height, props[i].value);

      bg.setOrigin(0, 0);
      bg.setScrollFactor(0);
      backgrounds.push(bg);
    }
    return backgrounds;
  }

  //custom tile collision callback
  private specialTileCollision(actor, tile): void{
    const data = tile.data.get('special');

    const tileHeight = tile.data.get('tileHeight');
    const tileHeightOffset = tile.data.get('tileHeightOffset');
    const tileY = tile.y + tileHeight/2 - actor.body.height;
    const tileType = tile.data.get('special');
    //Calculate where the ground is based on percentage actor has crosssed (like a bridge)
    const tileBegin = (tileType === 'diagonal-left') ? tile.x-actor.body.width : tile.x+tile.width;
    const tileEnd = (tileType === 'diagonal-left') ? tile.x+tile.width-actor.body.width : tile.x;

    let actorCrossPercent = (actor.x-tileBegin) / (tileEnd-tileBegin);
    if (actorCrossPercent > 1) actorCrossPercent = 1;

    const actorOffset = actorCrossPercent * tileHeight;

    // const ground = tileY - actorOffset - 4;
    // const ground = tileY - actorOffset;
    const ground = tileY - actorOffset - tileHeightOffset;

    //if actor is just over ground limit, and limit to bottom 5 pixels of actor body
    if (actor.y > ground && (actor.y - ground) < 30){
      actor.setPosition(actor.x, ground);
      actor.body.setVelocityY(0);
      actor.body.blocked.down = true;
    }
  }

  private createTileMap(): void {
    const mapTilesets = this.map.tilesets
      .filter(set => set.name !== 'enemy-sprites') //filter out enemy sprite spritesheet
      .map(tileset => {
        return this.map.addTilesetImage(tileset.name);
      });

    //construct layers into phaser using logic from .json made with Tiled
    this.backLayer = this.map.createLayer("Back Layer", mapTilesets, 0, 0);
    this.mainLayer = this.map.createLayer("Main Layer", mapTilesets, 0, 0);
    this.mainLayer.setCollisionByProperty({ collides: true });

    // custom properties passed in Tiled project, saved as special property
    let specialTiles = this.mainLayer.filterTiles(t => t.properties.special);
    specialTiles.forEach(t => {
      //handle use cases for special tiles
      switch (t.properties.special) {
        case 'top-plat':
          t.setCollision(false, false, true, false);
          break;
        case 'diagonal-right':
        case 'diagonal-left':
          let physicsBody = this.physics.add.image(t.pixelX+8, t.pixelY+8, '_');
          this.physicObjects.add(physicsBody);

          physicsBody.body.setAllowGravity(false);
          physicsBody.body.setImmovable(true);
          physicsBody.setDataEnabled();
          physicsBody.data.set('special', t.properties.special);
          physicsBody.data.set('tileHeight', t.properties.tileHeight);
          physicsBody.data.set('tileHeightOffset', t.properties.tileHeightOffset);
          // console.log(t.properties);
          break;
        default:
      }
    });

    this.enemyLayer = this.map.getObjectLayer("Enemy Objects");
  }

  //keybinding with Phaser
  private bindKeys(): void{
    this.keyRight = this.input.keyboard.addKey("RIGHT");
    this.keyLeft = this.input.keyboard.addKey("LEFT");
    this.keyDown = this.input.keyboard.addKey("DOWN");
    this.keyUp = this.input.keyboard.addKey("UP");

    this.keyA = this.input.keyboard.addKey("Z");
    this.keyB = this.input.keyboard.addKey("X");
    this.keyC = this.input.keyboard.addKey("C");

    //// DEBUG: input handlers
    this.keyQ = this.input.keyboard.addKey("Q");
    this.keyW = this.input.keyboard.addKey("W");
    this.keyE = this.input.keyboard.addKey("E");
    this.keyR = this.input.keyboard.addKey("R");
  }

  parallaxScroller(){
    let baseScrollSpeed = 0.01;
    this.backgrounds.forEach(background => {
      background.tilePositionX = this.cameras.main.scrollX * baseScrollSpeed;
      background.tilePositionY = this.cameras.main.scrollY * baseScrollSpeed;
      baseScrollSpeed += 0.2;
    });
  }

  update(time, delta) {
    this.parallaxScroller();
    this.player.update(this.keyboardController(), delta);

    // update enemies
    this.enemies.children.each(function(enemy){
      enemy.update();
    } ,this);
    // // update prejectiles
    this.projectiles.children.each(function(projectile){
      projectile.update();
    } ,this);


    //if player moves over map's x-width
    if (this.player.x > this.map.widthInPixels + this.mapThreshold) {
      this.player.x = 0;
    } else if (this.player.x < -this.mapThreshold) {
      this.player.x = this.map.widthInPixels;
    }

    if (this.player.y > this.map.heightInPixels + this.mapThreshold) {
      this.player.y = 0;
    } else if (this.player.y < -this.mapThreshold){
      this.player.y = this.map.heightInPixels;
    }
  }



  //input method handler for key events
  //returns concated string of input commands
  keyboardController(): string{
    let ans = '';

    //directional input
    if (this.keyDown.isDown) {
      ans = 'down-';
    } else if (this.keyUp.isDown) {
      ans = 'up-';
    } else if (this.keyRight.isDown) {
      ans = 'right-';
    } else if (this.keyLeft.isDown) {
      ans = 'left-';
    } else {
      ans = 'X-';
    }
    //action key A
    if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
      ans += 'D-';
    } else if (Phaser.Input.Keyboard.JustUp(this.keyA)) {
      ans += 'U-';
    } else if (this.keyA.isDown) {
      ans += 'O-';
    } else {
      ans += 'X-';
    }
    //action key B
    if (Phaser.Input.Keyboard.JustDown(this.keyB)) {
      ans += 'D-';
    } else if (Phaser.Input.Keyboard.JustUp(this.keyB)) {
      ans += 'U-';
    } else if (this.keyB.isDown) {
      ans += 'O-';
    } else {
      ans += 'X-';
    }
    //action key C
    if (Phaser.Input.Keyboard.JustDown(this.keyC)) {
      ans += 'D-';
    } else if (Phaser.Input.Keyboard.JustUp(this.keyC)) {
      ans += 'U-';
    } else if (this.keyC.isDown) {
      ans += 'O';
    } else {
      ans += 'X';
    }

    //// TODO: delete
    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
      // test input sample
    }
    if (Phaser.Input.Keyboard.JustDown(this.keyW)) {}
    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {}
    if (Phaser.Input.Keyboard.JustDown(this.keyR)) {}

    return ans;
  }



  //// TODO: debug and implement gamepad controls
  //BOILERPLATE CODE
  playerGamepad(): void{
    let pads = this.input.gamepad.gamepads;
    if (this.input.gamepad.total === 0)
    {
        return;
    }

    let debug = [];
    for (let i = 0; i < pads.length; i++)
    {
        let gamepad = pads[i];

        if (!gamepad)
        {
            continue;
        }

        //  Timestamp, index. ID
        debug.push(gamepad.id);
        debug.push('Index: ' + gamepad.index + ' Timestamp: ' + gamepad.timestamp);

        //  Buttons

        let buttons = '';

        for (let b = 0; b < gamepad.buttons.length; b++)
        {
            let button = gamepad.buttons[b];
            buttons = buttons.concat('B' + button.index + ': ' + button.value + '  ');
            // buttons = buttons.concat('B' + b + ': ' + button.value + '  ');

            if (b === 8)
            {
                debug.push(buttons);
                buttons = '';
            }
        }

        debug.push(buttons);

        //  Axis

        let axes = '';

        for (let a = 0; a < gamepad.axes.length; a++)
        {
            let axis = gamepad.axes[a];

            axes = axes.concat('A' + axis.index + ': ' + axis.getValue() + '  ');
            // axes = axes.concat('A' + a + ': ' + axis + '  ');

            if (a === 1)
            {
                debug.push(axes);
                axes = '';
            }
        }

        debug.push(axes);
        debug.push('');
    }
  }
}
