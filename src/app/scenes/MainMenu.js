import { Container, Text } from 'pixi.js';

export default function createMainMenu(app, switchScene) {
  const scene = new Container();

  const style = {
    fill: 0xffffff,
    fontSize: 32,
  };
  const title = new Text({
    text: 'IPC Dash - Click to Start',
    style
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
