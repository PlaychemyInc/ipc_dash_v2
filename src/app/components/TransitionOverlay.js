import { Container, Graphics } from 'pixi.js';

export default class TransitionOverlay extends Container {
  constructor(app, options = {}) {
    super();
    this.app = app;
    this.duration = options.duration || 500;
    this.overlay = new Graphics();
    this.overlay.beginFill(0x000000).drawRect(0, 0, app.screen.width, app.screen.height).endFill();
    this.overlay.alpha = 0;
    this.addChild(this.overlay);
  }

  fadeIn() {
    return new Promise((resolve) => {
      this.overlay.alpha = 1;
      // this.app.stage.addChild(this); TODO
      let elapsed = 0;

      const tick = (delta) => {
        elapsed += this.app.ticker.elapsedMS;
        this.overlay.alpha = 1 - Math.min(elapsed / this.duration, 1);

        if (elapsed >= this.duration) {
          this.app.ticker.remove(tick);
          this.app.stage.removeChild(this);
          resolve();
        }
      };

      this.app.ticker.add(tick);
    });
  }

  fadeOut() {
    return new Promise((resolve) => {
      this.overlay.alpha = 0;
      // this.app.stage.addChild(this); TODO
      let elapsed = 0;

      const tick = (delta) => {
        elapsed += this.app.ticker.elapsedMS;
        this.overlay.alpha = Math.min(elapsed / this.duration, 1);

        if (elapsed >= this.duration) {
          this.app.ticker.remove(tick);
          resolve();
        }
      };

      this.app.ticker.add(tick);
    });
  }
}
