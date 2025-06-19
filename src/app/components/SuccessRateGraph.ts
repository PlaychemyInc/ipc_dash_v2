import { Container, Graphics, Text } from 'pixi.js';

interface SuccessRateGraphConfig {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    bgColor?: number;
    fillColor?: number;
    labelText?: string;
    labelColor?: number;
    labelFontSize?: number;
}

export default class SuccessRateGraph {
    private container: Container;
    private barBg: Graphics;
    private barFill: Graphics;
    private label?: Text;
    private barWidth: number;
    private barHeight: number;
    private fillColor: number;
    private bgColor: number;

    constructor(config: SuccessRateGraphConfig = {}) {
        this.container = new Container();
        this.container.x = config.x ?? 0;
        this.container.y = config.y ?? 0;

        this.barWidth = config.width ?? 20;
        this.barHeight = config.height ?? 100;
        this.bgColor = config.bgColor ?? 0x444444;
        this.fillColor = config.fillColor ?? 0x00ff00;

        this.barBg = new Graphics();
        this.barBg.beginFill(this.bgColor)
            .drawRect(0, -this.barHeight / 2, this.barWidth, this.barHeight)
            .endFill();
        this.container.addChild(this.barBg);

        this.barFill = new Graphics();
        this.container.addChild(this.barFill);

        if (config.labelText) {
            this.label = new Text(config.labelText, {
                fill: config.labelColor ?? 0xffffff,
                fontSize: config.labelFontSize ?? 14
            });
            this.label.anchor.set(0.5, 0);
            this.label.x = this.barWidth / 2;
            this.label.y = this.barHeight / 2 + 5;
            this.container.addChild(this.label);
        }
    }

    /**
     * Set the progress bar fill (rate 0.0 - 1.0)
     */
    public setProgress(rate: number): void {
        // Clamp between 0 and 1
        rate = Math.max(0, Math.min(1, rate));

        // Clear previous fill
        this.barFill.clear();

        const fillHeight = this.barHeight * rate;
        const y = this.barHeight / 2 - fillHeight;

        this.barFill.beginFill(this.fillColor)
            .drawRect(0, y, this.barWidth, fillHeight)
            .endFill();
    }

    /**
     * Expose display object
     */
    public get displayObject(): Container {
        return this.container;
    }

    /**
     * Cleanup resources
     */
    public destroy(): void {
        this.barBg.destroy();
        this.barFill.destroy();
        this.label?.destroy();
        this.container.destroy({ children: true });
    }
}
