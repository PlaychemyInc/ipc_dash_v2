import { Container, Graphics, Application } from 'pixi.js';

interface TransitionOverlayOptions {
    duration?: number;
    color?: number;
}

export default class TransitionOverlay extends Container {
    private app: Application;
    private duration: number;
    private overlay: Graphics;
    private color: number;

    constructor(app: Application, options: TransitionOverlayOptions = {}) {
        super();

        this.app = app;
        this.duration = options.duration ?? 500;
        this.color = options.color ?? 0x000000;

        this.overlay = new Graphics();
        this.drawOverlay();
        this.addChild(this.overlay);
    }

    private drawOverlay(): void {
        this.overlay.clear();
        this.overlay.beginFill(this.color)
            .drawRect(0, 0, this.app.screen.width, this.app.screen.height)
            .endFill();
        this.overlay.alpha = 0;
    }

    private animate(targetAlpha: number): Promise<void> {
        return new Promise((resolve) => {
            let elapsed = 0;
            const startAlpha = this.overlay.alpha;
            const deltaAlpha = targetAlpha - startAlpha;

            const tick = () => {
                elapsed += this.app.ticker.elapsedMS;
                const progress = Math.min(elapsed / this.duration, 1);
                this.overlay.alpha = startAlpha + deltaAlpha * progress;

                if (progress >= 1) {
                    this.app.ticker.remove(tick);
                    if (targetAlpha === 0) {
                        this.app.stage.removeChild(this);
                    }
                    resolve();
                }
            };

            this.app.ticker.add(tick);
        });
    }

    public async fadeIn(): Promise<void> {
        this.overlay.alpha = 1;
        this.app.stage.addChild(this);
        await this.animate(0);
    }

    public async fadeOut(): Promise<void> {
        this.overlay.alpha = 0;
        this.app.stage.addChild(this);
        await this.animate(1);
    }

    public updateScreenSize(): void {
        this.drawOverlay();
    }

    public destroy(): void {
        this.overlay.destroy();
        super.destroy();
    }
}
