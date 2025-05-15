import { Container, Graphics, Text } from 'pixi.js';
import BasicButton from './BasicButton';

export default class BasicPopup extends Container {
  constructor(app, message, onClose = () => {}) {
    super();

    const overlay = new Graphics()
      .beginFill(0x000000, 0.5)
      .drawRect(0, 0, app.screen.width, app.screen.height)
      .endFill();
    this.addChild(overlay);

    const box = new Graphics()
      .beginFill(0xffffff)
      .drawRoundedRect(0, 0, 300, 200, 20)
      .endFill();
    box.x = app.screen.width / 2 - 150;
    box.y = app.screen.height / 2 - 100;
    this.addChild(box);

    const text = new Text(message, {
      fill: 0x000000,
      fontSize: 18,
      wordWrap: true,
      wordWrapWidth: 260,
    });
    text.x = box.x + 20;
    text.y = box.y + 40;
    this.addChild(text);

    const closeBtn = new BasicButton('Close', 100, 40, () => {
      this.parent.removeChild(this);
      onClose();
    });
    closeBtn.x = box.x + 100;
    closeBtn.y = box.y + 130;
    this.addChild(closeBtn);
  }
}
