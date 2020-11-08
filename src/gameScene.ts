import { SpeechBubbleConfig } from './utils/interfaces';

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

import SpeechBubble from './utils/speechBubble';
import Exit from './utils/exit';


export default class GameScene extends Phaser.Scene
{
  backgrounds: Phaser.GameObjects.TileSprite[];
  background0: Phaser.GameObjects.TileSprite;
  background1: Phaser.GameObjects.TileSprite;

  playerAudio: any;
  music: Phaser.Sound.BaseSound;

  projectiles: Phaser.GameObjects.Group;
  speeches: Phaser.GameObjects.Group;
  enemies: Phaser.Physics.Arcade.Group;
  exits: Phaser.Physics.Arcade.Group;
  player: Player;

  map: Phaser.Tilemaps.Tilemap;
  mainLayer: Phaser.Tilemaps.StaticTilemapLayer;
  backLayer: Phaser.Tilemaps.StaticTilemapLayer;
  enemyLayer: Phaser.Tilemaps.ObjectLayer;

  keyRight: Phaser.Input.Keyboard.Key;
  keyLeft: Phaser.Input.Keyboard.Key;
  keyJump: Phaser.Input.Keyboard.Key;
  keyShout: Phaser.Input.Keyboard.Key;
  keyCrouch: Phaser.Input.Keyboard.Key;
  keyAttack: Phaser.Input.Keyboard.Key;

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
    //create map object first, then tilesprite bg, then populate tiled map from json
    this.map = this.make.tilemap({
      key: sceneParams.map,
      tileWidth: 16,
      tileHeight: 16
    });
    this.createBG();
    this.createTileMap();

    this.bindKeys();

    // create audios
    //TODO move individual sound audios to sprite class
    this.playerAudio = {
      attack: this.sound.add("attack"),
      hurt: this.sound.add("hurt"),
      jump: this.sound.add("jump"),
      kill: this.sound.add("kill"),
    };
    this.music = this.sound.add("music", {loop: true, volume: 0.5});
    // this.music.play();

    this.player = new Player(this, {x: sceneParams.x, y: sceneParams.y, audio: this.playerAudio});
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.speeches = this.physics.add.group();
    this.exits = this.physics.add.group();

    this.populateEnemies();

    this.input.enabled = true;
    // camera
    this.cameras.main.setBounds(32, 32, this.map.widthInPixels-64, this.map.heightInPixels-32);
    this.cameras.main.startFollow(this.player);

    // physics
    this.physics.add.collider(this.mainLayer, this.player, this.landPlayer, null, this);
    this.physics.add.collider(this.mainLayer, this.enemies);
    // overlaps
    this.physics.add.overlap(this.player, this.enemies, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.player, this.projectiles, this.hurtPlayer, null, this);
    this.physics.add.overlap(this.player, this.exits, this.exitTo, null, this);

    this.physics.add.overlap(this.enemies, this.speeches, this.respondToCall, null, this);
    this.physics.add.overlap(this.player, this.speeches, this.queNextCall, null, this);

  }

  respondToCall(responder, bubble){
    if (responder.name !== "avatar") {
      let response = responder.getResponse(bubble.quote);
      bubble.destroySpeechBody();
      if (response) {
        let rDelay = Phaser.Math.Between(response.minDelay, response.maxDelay);
        let rCallback = () => new SpeechBubble(this, responder, response);
        this.time.addEvent({ delay: rDelay, callback: rCallback, callbackScope: this });
      }
    }
  }
  queNextCall(player, bubble){
    if (player.name === bubble.name) return;
    player.setCallInQue(bubble);
  }


  //TODO handle logic for player/map collisions
  //bug where player.y velocity converts into forward momementum during specific lands
  landPlayer(player, layer){
    // console.log(player.body.velocity.x, player.body.velocity.y);
    // console.log(player.velocity.x, player.velocity.y);
    // this.player.crouch();
  }
  exitTo(player, exit){

    let sceneConfig = {
      map: exit.properties.map,
      x: (exit.properties.x) ? exit.properties.x : Math.floor(this.player.x),
      y: (exit.properties.y) ? exit.properties.y : Math.floor(this.player.y),
    }
    this.scene.start('game', sceneConfig);
  }

  //TODO add more logic to player enemy collisions
  hurtPlayer(player, enemy){
    if (!enemy.active){
      // collision and enmey unactive');
    } else if (player.isAttacking){
      let temp = new EnemyDeath(this, enemy.x, enemy.y);
      player.movementBoost();
      enemy.destroy();
      // this.audioKill.play();
    } else if (player.body.touching.down){
      player.jumpInit();
      player.jump();
      let temp = new EnemyDeath(this, enemy.x, enemy.y);
      enemy.destroy();
      // this.audioKill.play();
    } else if (player.body.touching.left || player.body.touching.right || player.body.touching.up){

      player.isHurt = true;
      player.body.velocity.y = -150;
      player.body.velocity.x = (player.x > enemy.x) ? -100 : 100;
      // this.audioHurt.play();

      // this.scene.start('game');
    }
  }

  private createBG():void {
    let config = {
      width: this.sys.canvas.width,
      height: this.sys.canvas.height
    };
    this.backgrounds = this.createTileSpriteBG(config, this.map.properties);
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

  private createTileMap(): void {

    const mapTilesets = this.map.tilesets
      .filter(set => set.name !== 'enemy-sprites') //filter out enemy sprite spritesheet
      .map(tileset => {
        return this.map.addTilesetImage(tileset.name);
      });

    this.backLayer = this.map.createStaticLayer("Back Layer", mapTilesets, 0, 0);
    this.mainLayer = this.map.createStaticLayer("Main Layer", mapTilesets, 0, 0);
    this.mainLayer.setCollisionByProperty({ collides: true });

    let specialTiles = this.mainLayer.filterTiles(t => t.properties.collisionSide);
    specialTiles.forEach(t => {
      let split = t.properties.collisionSide.split('-'); //TODO testing dynamic sides
      t.setCollision(false, false, true, false); //sets collision for top only, classic bottom only collision platform
    });

    this.enemyLayer = this.map.getObjectLayer("Enemy Objects");
  }

  private bindKeys(): void{
    this.keyRight = this.input.keyboard.addKey("RIGHT");
    this.keyLeft = this.input.keyboard.addKey("LEFT");
    this.keyCrouch = this.input.keyboard.addKey("DOWN");
    this.keyShout = this.input.keyboard.addKey("Z");
    this.keyJump = this.input.keyboard.addKey("X");
    this.keyAttack = this.input.keyboard.addKey("C");
  }

  private populateEnemies(): void{
    this.enemyLayer.objects.forEach(enemy => {
      switch (enemy.name) {
        case "burning-ghoul":
          let ghoul = new BurningGhoul(this, enemy.x, enemy.y);
          break;
        case "skeleton":
          let skeleton = new Skeleton(this, enemy.x, enemy.y, this.player);
          break;
        case "angel":
          let angel = new Angel(this, enemy);
          break;
        case "wizard":
          let wizard = new Wizard(this, enemy);
          break;
        case "helo-gato":
          let hellgato = new HellGato(this, enemy.x, enemy.y);
          break;
        case "ghost":
          let ghost = new Ghost(this, enemy);
          break;
        case "oreh":
          let oreh = new Oreh(this, enemy);
          break;
        case "exit":
          let exit = new Exit(this, enemy);
          break;
        default:

      }
    });
  }


  update() {
    this.playerController();
    this.parallaxScroller();

    // update entities
    this.player.update();
    // update enemies
    this.enemies.children.each(function(enemy){
      enemy.update();
    } ,this);
    // // update prejectiles
    this.projectiles.children.each(function(projectile){
      projectile.update();
    } ,this);

    // 256
    // exit/restart game
    if(this.player.x > this.map.widthInPixels || this.player.x < 0){
      this.scene.start("game");
      // this.music.stop();
    } else if (this.player.y > this.map.heightInPixels || this.player.y < -200){
      this.scene.start("game");
    }
  }

  parallaxScroller(){
      let baseScrollSpeed = 0.01;
      this.backgrounds.forEach(background => {
        background.tilePositionX = this.cameras.main.scrollX * baseScrollSpeed;
        baseScrollSpeed += 0.2;
      });
  }


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
  playerController() {
    if (this.player.isAttacking || this.player.isAirAttacking ) {
      return;
    }

    if (this.keyRight.isDown) {
      this.player.moveRight();
    } else if (this.keyLeft.isDown) {
      this.player.moveLeft();
    } else {
      this.player.stopMove();
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyShout) && !this.player.disableSpeech) {
      // let speech = this.player.getCall();
      new SpeechBubble(this, this.player, this.player.getCall());
    }
    if (this.keyJump.isDown && this.player.body.onFloor() && !this.player.isJumping) {
      this.player.jumpInit();
    } else if (this.keyJump.isDown && this.player.isJumping){
      this.player.jump();
    } else if (Phaser.Input.Keyboard.JustUp(this.keyJump)) {
      this.player.jumpEnd();
    }

    if (this.keyCrouch.isDown && this.player.body.onFloor()) {
      this.player.crouch();
    } else if (this.keyCrouch.isUp) {
      this.player.standUp();
    }


    if (Phaser.Input.Keyboard.JustDown(this.keyAttack)) {
      this.player.isRunning = true;
      if (this.player.isCrouching){
        this.player.crouchAttack();
      } else if (this.player.body.onFloor()){
        this.player.attack();
      } else {
        // this.player.airAttack();
      }
    } else if (Phaser.Input.Keyboard.JustUp(this.keyAttack)){
      this.player.isRunning = false;
    }
  }
}
