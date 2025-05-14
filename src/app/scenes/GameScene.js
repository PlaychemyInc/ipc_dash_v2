import { Container, Text } from 'pixi.js';

export default function createGameScene(app, switchScene) {
  const scene = new Container();

  const text = new Text('🕹 Game Scene - Click to Go Back', {
    fill: 0x00ff00,
    fontSize: 32,
  });
  text.anchor.set(0.5);
  text.x = app.screen.width / 2;
  text.y = app.screen.height / 2;
  text.eventMode = 'static';
  text.cursor = 'pointer';

  text.on('pointerdown', () => switchScene('menu'));

  scene.addChild(text);
  return scene;
}
