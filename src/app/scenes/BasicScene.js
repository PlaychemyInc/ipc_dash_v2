import { Container } from 'pixi.js';

export default class BasicScene {
  constructor(game, key) {
    this.game = game;
    this.app = game.app;
    this.key = key;
    this.scene = new Container();
    this.app.stage.addChild(this.scene);

    this.load().then(this.onLoadComplete.bind(this));
    
  }

  async load() {
    this.assets = await this.game.assets.loadBundle(this.key);
    
  }

  onLoadComplete() {

  }

  add(object){
    this.scene.addChild(object);
  }

  setScene(key){
    this.game.sceneManager.setScene(key);
  }


}