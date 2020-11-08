export default class Bar extends Phaser.GameObjects.Container{
  // private height: this.scene.game.config.height;
  constructor(config){
    super(config.scene);
    this.scene = config.scene;
    this.scene.add.existing(this);

    let progressBar = this.scene.add.graphics();
    let progressBox = this.scene.add.graphics();
    let boxWidth: number = 80;
    let boxHeight = 10;
    let barWidth = boxWidth - 4;
    let barHeight = boxHeight - 4;

    let boxCenterX: number = this.scene.sys.canvas.width/2 - boxWidth/2;
    let boxCenterY: number = this.scene.sys.canvas.height/2 - boxHeight/2;
    let barCenterX = boxCenterX + 2;
    let barCenterY = boxCenterY + 2;

    progressBox.fillStyle(0xffffff, 0.6);
    progressBox.fillRect(boxCenterX, boxCenterY, boxWidth, boxHeight);

    this.scene.load.on('progress', function(value) {
      var mybarWidth = barWidth - 4;
      progressBar.clear();
      progressBar.fillStyle(0xffffff, 1);
      progressBar.fillRect(barCenterX , barCenterY, barWidth * value, barHeight);
    });

   }
}
