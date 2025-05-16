import { Text } from 'pixi.js';
import BasicScene from './BasicScene'

export default class initScene extends BasicScene {
  constructor(game) {
    super(game, 'init-scene');
  }

  onLoadComplete() {
    this.addText();
  }

  addText() {
    const style = {
      fill: 0xffffff,
      fontSize: 32,
    };
    const title = new Text({
      text: 'IPC Dash - Click to Start',
      style
    });
    title.anchor.set(0.5);
    title.x = this.app.screen.width / 2;
    title.y = this.app.screen.height / 2;
    title.eventMode = 'static';
    title.cursor = 'pointer';

    title.on('pointerdown', () => this.setScene('game'));

    this.add(title)
  }
}