import { Container, Graphics, Text, Assets, Sprite } from 'pixi.js';
import BasicButton from './BasicButton';
import InputLabel from './InputLabel';


export default class WinPopup {
  constructor(x, y) {

    this.container = new Container();
    this.container.x = x;
    this.container.y = y;
    this.container.sortableChildren = true;

    this.sprite = new Sprite(Assets.get('HallOfFame'));
    this.sprite.anchor.set(0.5);
    this.container.addChild(this.sprite);

  }

  setVisibility(flag){
    this.container.visible = flag;
  }

  get displayObject() {
    return this.container;
  }

}
