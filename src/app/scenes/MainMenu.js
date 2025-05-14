import { Container, Text } from 'pixi.js';

export default function createMainMenu(app, switchScene) {
  const scene = new Container();

  const title = new Text('🎮 Main Menu - Click to Start', {
    fill: 0xffffff,
    fontSize: 32,
  });
  title.anchor.set(0.5);
  title.x = app.screen.width / 2;
  title.y = app.screen.height / 2;
  title.eventMode = 'static';
  title.cursor = 'pointer';

  title.on('pointerdown', () => switchScene('game'));

  scene.addChild(title);
  return scene;
}
