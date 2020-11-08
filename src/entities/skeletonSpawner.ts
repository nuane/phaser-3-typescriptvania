//don't know if i want code, just figured out it spawns skeletongs when close to player


import Skeleton from './entities/skeleton'; //import skeleton class to spawn dynamically
export default class SkeletonSpawner extends Phaser.GameObjects.Sprite{
  body: Phaser.Physics.Arcade.Body;
  public scene: Phaser.Scene;
  public player: Phaser.GameObjects.Sprite;

  private name: string = "skeleton_spawner";
  private spawnInFront: boolean;

  constructor(scene,x,y, spawnInFront: boolean) {
    super(scene, x, y);
    this.scene = scene;
    this.player = player;
    this.spawnInFront = spawnInFront;

    scene.add.existing(this);
    scene.enemies.add(this);

  }

  update(){
    if(this.spawnInfront){
  		// spawn in front
  		if( player.x  > this.x - 9* 16 ){

  	        var temp = new Skeleton(game, this.x / 16, ( this.y / 16) - 34/ 16 );
  	        game.add.existing(temp);
  	        enemies_group.add(temp);

  			this.destroy();

  		}
  	}else{
  		// spawn in back
  		if( player.x  > this.x + 6 * 16 ){

  	        var temp = new Skeleton(game, this.x / 16, ( this.y / 16) - 34/ 16 );
  	        game.add.existing(temp);
  	        enemies_group.add(temp);

  			this.destroy();


  		}
  	}

}
