import 'phaser';
import Boot from './bootScene';
import TitleScene from './titleScene';
import GameScene from './gameScene';

const DEFAULT_WIDTH: number = 320
const DEFAULT_HEIGHT: number = 200

window.addEventListener('load', () => {
  const config = {
    type: Phaser.AUTO,
    backgroundColor: '#ffffff',
    parent: 'phaser-game',
    scale: {
      // The game will be scaled manually in the resize()
      mode: Phaser.Scale.FIT,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT
    },

    scene: [Boot,TitleScene, GameScene],
    // scene: [Boot,TitleScene],
    // render:

  }

  const game = new Phaser.Game(config)

})
