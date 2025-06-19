import { Container, Graphics, Text, TextStyle } from 'pixi.js';

interface ButtonOptions {
  width?: number;
  height?: number;
  backgroundColor?: number;
  hoverColor?: number;
  radius?: number;
  fontSize?: number;
  labelColor?: number;
  onClick?: () => void;
}

export default class BasicButton extends Container {

  private bg: Graphics;
  private textLabel: Text;
  private options: Required<ButtonOptions>;

  constructor(labelText: string, options: ButtonOptions = {}) {

    super();
    this.interactive = true;
    this.cursor = 'pointer';

    // Default options
    this.options = {
      width: options.width ?? 150,
      height: options.height ?? 50,
      backgroundColor: options.backgroundColor ?? 0x3366ff,
      hoverColor: options.hoverColor ?? 0x5599ff,
      radius: options.radius ?? 10,
      fontSize: options.fontSize ?? 18,
      labelColor: options.labelColor ?? 0xffffff,
      onClick: options.onClick ?? (() => { })
    };

    // Draw background
    this.bg = new Graphics();
    this.drawBackground(this.options.backgroundColor);
    this.addChild(this.bg);

    // Add label
    const style = new TextStyle({
      fill: this.options.labelColor,
      fontSize: this.options.fontSize,
    });

    this.textLabel = new Text({ text: labelText, style });
    this.textLabel.anchor.set(0.5);
    this.textLabel.x = this.options.width / 2;
    this.textLabel.y = this.options.height / 2;
    this.addChild(this.textLabel);

    // Event listeners
    this.on('pointertap', this.options.onClick);
    this.on('pointerover', this.onHoverIn.bind(this));
    this.on('pointerout', this.onHoverOut.bind(this));
  }

  public drawBackground(color: number): void {
    // this.bg.clear();
    this.bg.roundRect(0, 0, this.options.width, this.options.height, this.options.radius);
    this.bg.fill(color);
  }

  private onHoverIn(): void {
    this.drawBackground(this.options.hoverColor);
  }

  private onHoverOut(): void {
    this.drawBackground(this.options.backgroundColor);
  }

  public destroy(options?: boolean | { children?: boolean; texture?: boolean; baseTexture?: boolean }): void {
    // Remove event listeners
    this.off('pointertap', this.options.onClick);
    this.off('pointerover', this.onHoverIn.bind(this));
    this.off('pointerout', this.onHoverOut.bind(this));

    // Call super destroy
    super.destroy(options);
  }

}
