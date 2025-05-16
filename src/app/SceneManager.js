import initScene from './scenes/initScene';
import gameScene from './scenes/GameScene';
import createLoadingScene from './scenes/LoadingScene';
import TransitionOverlay from './TransitionOverlay';

export default class SceneManager {
  constructor(game) {
    this.game = game;
    this.app = game.app;
    this.currentScene = null;
    this.transition = new TransitionOverlay(this.app, { duration: 500 });
  }


  async setScene(key) {
    await this.transition.fadeOut();

    if (this.currentScene) {
      this.app.stage. removeChildren(0);
    }


    switch (key) {
      case 'init':
        this.currentScene = new initScene(this.game);
        break;
      case 'game':
        this.currentScene = new gameScene(this.game);
        break;

    }

    
    await this.transition.fadeIn();

    return this.currentScene;
  }

}


