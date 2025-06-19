import { Sprite, Texture } from 'pixi.js';

export default class BackgroundManager {
    private scene: any;
    private layers: Record<string, Sprite> = {};

    constructor(scene: any, assets: Record<string, Texture>) {
        this.scene = scene;

        this.layers['sky'] = this.addLayer('sky', assets);
        this.layers['mountains'] = this.addLayer('mountains', assets);
        this.layers['trees'] = this.addLayer('trees', assets);
        this.layers['grass'] = this.addLayer('grass', assets);
        this.layers['water'] = this.addLayer('water', assets);
        this.layers['topItems'] = this.addLayer('topItems', assets);
    }

    private addLayer(key: string, assets: Record<string, Texture>): Sprite {
        const sprite = Sprite.from(assets[key] ?? Texture.EMPTY);
        sprite.anchor.set(0, 0);
        sprite.x = 0;
        sprite.y = 0;
        this.scene.add(sprite);
        return sprite;
    }

    public destroy(): void {
        Object.values(this.layers).forEach(layer => layer.destroy());
    }
}