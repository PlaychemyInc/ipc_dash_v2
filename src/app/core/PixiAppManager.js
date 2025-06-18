import { Application } from 'pixi.js';

export default class PixiAppManager {
    constructor(container) {
        this.container = container;
        this.app = null;
    }

    async init() {
        this.app = new Application();
        await this.app.init({
            resizeTo: window
        });
        this.container.appendChild(this.app.canvas);
    }

    destroy() {
        if (this.app) {
            this.app.destroy(true, { children: true, texture: true, baseTexture: true });
            this.app = null;
        }
    }
}