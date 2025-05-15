import createMainMenu from './scenes/MainMenu';
import createGameScene from './scenes/GameScene';
import createLoadingScene from './scenes/LoadingScene';
import TransitionOverlay from './TransitionOverlay';

export default class SceneManager {
  constructor(app) {
    this.app = app;
    this.currentScene = null;
    this.transition = new TransitionOverlay(app, { duration: 500 });
  }

  async changeScene(sceneName) {
    await this.transition.fadeOut();

    if (this.currentScene) {
      this.app.stage.removeChild(this.currentScene);
      this.currentScene.destroy({ children: true });
    }

    const loadAssets = {
      menu: [ { alias: 'player', src: 'assets/player.png' }],
      game: [
        { alias: 'player', src: 'assets/player.png' },
        { alias: 'enemy', src: 'assets/enemy.png' },
        { alias: 'input', src: 'assets/input.png' },
      ],
    };

    await createLoadingScene(this.app, loadAssets[sceneName] || [], async () => {
      if (sceneName === 'menu') {
        this.currentScene = createMainMenu(this.app, this.changeScene.bind(this));
      } else if (sceneName === 'game') {
        this.currentScene = createGameScene(this.app, this.changeScene.bind(this));
      }

      this.app.stage.addChild(this.currentScene);
      await this.transition.fadeIn();
    });
  }
}

//     if (sceneName === 'menu') {
//       this.currentScene = createMainMenu(this.app, this.changeScene.bind(this));
//     } else if (sceneName === 'game') {
//       this.currentScene = createGameScene(this.app, this.changeScene.bind(this));
//     }

//     this.app.stage.addChild(this.currentScene);
//   }
// }
