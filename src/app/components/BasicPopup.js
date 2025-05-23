import { Container, Graphics, Text } from 'pixi.js';
import BasicButton from './BasicButton';
import InputLabel from './InputLabel';


export default class BasicPopup extends Container {
  constructor(app, message, onClose = () => {}) {
    super();

    // const overlay = new Graphics()
    //   .beginFill(0x000000, 0.5)
    //   .drawRect(0, 0, app.screen.width, app.screen.height)
    //   .endFill();
    // this.addChild(overlay);

    var bg_width = 300;
    var bg_height = 300;

    const box = new Graphics()
      .beginFill(0xffffff)
      .drawRoundedRect(0, 0, 300, 200, 20)
      .endFill();
    box.x = (app.screen.width - bg_width)/2;
    box.y = (app.screen.height - bg_height)/2;
    this.addChild(box);

    const text = new Text(message, {
      fill: 0x000000,
      fontSize: 18,
      wordWrap: true,
      wordWrapWidth: bg_width - 40,
    });
    text.x = box.x + 20;
    text.y = box.y + 40;
    this.addChild(text);

    this.input = new InputLabel({
        label: '',
        placeholder: 'IPC ID',
        x: box.x,
        y: box.y+40,
    });
    this.addChild(this.input);

    const closeBtn = new BasicButton('Add', 100, 40, () => {
      var addIPC = this.input.getValue();
      this.input.setValue('');
      // this.parent.removeChild(this);
      onClose(addIPC);
    });
    closeBtn.x = box.x + 100;
    closeBtn.y = box.y + 130;
    this.addChild(closeBtn);
  }
}
