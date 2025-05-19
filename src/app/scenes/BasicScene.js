import { Container } from 'pixi.js';

export default class BasicScene {
  constructor(game, key) {
    this.game = game;
    this.key = key;
    this.scene = new Container();
    this.game.app.stage.addChild(this.scene);

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

  getScreenWidth(){
    return this.game.app.screen.width;
  }

  getScreenHeight(){
    return this.game.app.screen.height;
  }

  updateScreenSize(){
    
  }


}