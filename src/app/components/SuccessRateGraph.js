import { Container, Graphics, Text, AnimatedSprite, Ticker, Assets } from 'pixi.js';


export default class SuccessRateGraph {
    constructor(config) {
        // / Container for the bar
        this.container = new Container();
        this.container.x = config.x;
        this.container.y = config.y;
        // app.stage.addChild(this.container);

        // Dimensions
        this.barWidth = config.width;
        this.barHeight = config.height;

        // Background bar
        this.barBg = new Graphics()
            .rect(0, 0, this.barWidth, this.barHeight)
            .fill(0x444444);
        this.barBg.y -= this.barHeight/2;
        this.container.addChild(this.barBg);

        // Foreground fill (dynamic)
        this.barFill = new Graphics();
        this.container.addChild(this.barFill);

        // Label
        // this.label = new Text( {
        //     text: 'Success Rate',
        //     fill: '#ffffff',
        //     fontSize: 14,
        // });
        // this.label.x = -20;
        // this.label.y = this.barHeight + 5;
        // this.container.addChild(this.label);

    }

    // Function to update the progress bar
    setProgress(rate) {
        // Clamp value between 0 and 1
        // rate = Math.max(0, Math.min(1, rate));

        // Clear previous fill
        this.barFill.clear();

        // Draw fill from bottom up
        const fillHeight = this.barHeight * rate;
        const y = this.barHeight - fillHeight - this.barHeight/2;

        this.barFill
            .rect(0, y, this.barWidth, fillHeight)
            .fill(0x00ff00);

    }

    get displayObject() {
        return this.container;
    }
}