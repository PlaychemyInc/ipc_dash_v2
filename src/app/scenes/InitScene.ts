import { Text, TextStyle } from 'pixi.js';
import BasicScene from './BasicScene';

export default class InitScene extends BasicScene {

  private _title?: Text;

  constructor(game: any) {
    super(game, 'init-scene');
  }

  protected onLoadComplete(): void {
    this.addTitleText();
  }

  private addTitleText(): void {

    const style = new TextStyle({
      fill: 0xffffff,
      fontSize: 32,
    });

    const title = new Text('IPC Dash - Click to Start', style);

    title.anchor.set(0.5);
    title.x = this.getScreenWidth() / 2;
    title.y = this.getScreenHeight() / 2;
    title.eventMode = 'static';
    title.cursor = 'pointer';

    title.on('pointerdown', () => this.setScene('game'));

    this.add(title);
    this._title = title;
  }

  public updateScreenSize(): void {
    if (this._title) {
      this._title.x = this.getScreenWidth() / 2;
      this._title.y = this.getScreenHeight() / 2;
    }
  }

  public destroy(): void {
    if (this._title) {
      this._title.destroy();
      this._title = undefined;
    }
    super.destroy();
  }
}