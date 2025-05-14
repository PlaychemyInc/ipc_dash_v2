import { Container, Graphics, Sprite, Assets, Text } from 'pixi.js';

export default async function createLoadingScene(app, assetsToLoad, onComplete) {
  const scene = new Container();
    console.log("Loading Logo...");
  // Load logo first (without progress)
   Assets.add({alias: 'logo', src: 'assets/logo.png'});
   await Assets.load('logo');

  const logo = Sprite.from('logo');
  logo.anchor.set(0.5);
  logo.x = app.screen.width / 2;
  logo.y = app.screen.height / 2 - 100;
  scene.addChild(logo);

  // Create progress bar background
  const barWidth = 300;
  const barHeight = 20;
  const progressBg = new Graphics().rect(0, 0, barWidth, barHeight).fill(0x444444);
    // .beginFill(0x444444)
    // .drawRoundedRect(0, 0, barWidth, barHeight, 10)
    // .endFill();
  progressBg.x = app.screen.width / 2 - barWidth / 2;
  progressBg.y = app.screen.height / 2 + 30;
  scene.addChild(progressBg);

  // Create progress bar fill
  const progressFill = new Graphics();
  progressFill.x = progressBg.x;
  progressFill.y = progressBg.y;
  scene.addChild(progressFill);

  // Optional loading text
  const loadingText = new Text('Loading...', {
    fill: 0xffffff,
    fontSize: 20,
  });
  loadingText.anchor.set(0.5);
  loadingText.x = app.screen.width / 2;
  loadingText.y = progressBg.y - 30;
  scene.addChild(loadingText);

  // Add to stage immediately
  app.stage.addChild(scene);

  console.log("Loading Assets...");
  // Begin loading assets
  await Assets.load(assetsToLoad, (progress) => {
    const percent = progress * 100;
    progressFill.clear().rect(0, 0, (barWidth * progress), barHeight).fill(0x00ff00);

    // progressFill.clear()
    //   .beginFill(0x00ff00)
    //   .drawRoundedRect(0, 0, (barWidth * progress), barHeight, 10)
    //   .endFill();
  });

  // Short delay for UX (optional)
  setTimeout(() => {
    app.stage.removeChild(scene);
    scene.destroy({ children: true });
    onComplete(); // Load next scene
  }, 300);
}
