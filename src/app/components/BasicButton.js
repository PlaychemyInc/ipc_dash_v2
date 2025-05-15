import { Container, Graphics, Text } from 'pixi.js';

export default class BasicButton extends Container {
  constructor(label, width = 150, height = 50, onClick = () => {}) {
    super();
    this.interactive = true;
    this.cursor = 'pointer';

    this.bg = new Graphics()
      .beginFill(0x3366ff)
      .drawRoundedRect(0, 0, width, height, 10)
      .endFill();
    this.addChild(this.bg);

    this.label = new Text(label, {
      fill: 0xffffff,
      fontSize: 18,
    });
    this.label.anchor.set(0.5);
    this.label.x = width / 2;
    this.label.y = height / 2;
    this.addChild(this.label);

    this.on('pointertap', onClick);

    this.on('pointerover', () => {
      this.bg.tint = 0x5599ff;
    });

    this.on('pointerout', () => {
      this.bg.tint = 0xffffff;
    });
  }
}
