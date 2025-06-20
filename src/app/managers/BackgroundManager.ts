import { Container, Sprite, Texture } from 'pixi.js';
import Camera from '../components/Camera';
import { GameConfig } from '../config';


export default class BackgroundManager {
    private scene: any;
    private assets: any;
    private layers: Record<string, Sprite[]> = {};
    private finalLineSprite: Sprite;

    constructor(scene: any, assets: Record<string, Texture>) {
        this.scene = scene;
        this.assets = assets;

        this.layers['sky'] = [];
        this.layers['mountains'] = [];
        this.layers['trees'] = [];
        this.layers['grass'] = [];
        this.layers['water'] = [];
        this.layers['topItems'] = [];

        this.layers['sky'].push(this.addSprite('sky', assets));
        this.layers['mountains'].push(this.addSprite('mountains', assets));
        this.layers['trees'].push(this.addSprite('trees', assets));
        this.layers['grass'].push(this.addSprite('grass', assets));
        this.layers['water'].push(this.addSprite('water', assets));
        this.layers['topItems'].push(this.addSprite('topItems', assets));

        this.finalLineSprite = this.addSprite('finalLine', assets);


        // Camera.getInstance().addToMoveWithCamera(this.layers['grass']);
    }

    private addSprite(key: string, assets: Record<string, Texture>): Sprite {
        const sprite = Sprite.from(assets[key] ?? Texture.EMPTY);
        sprite.anchor.set(0, 0);
        sprite.x = 0;
        sprite.y = 0;
        this.scene.add(sprite);
        return sprite;
    }

    public ensureBackgroundFillsScreen(screenWidth: number, screenHeight: number): void {

        Object.entries(this.layers).forEach(([layerName, spriteArray]) => {
            if (spriteArray.length === 0) return; // skip empty layers

            const lastSprite = spriteArray[spriteArray.length - 1];

            if (lastSprite.x + lastSprite.width < screenWidth) {

                const sprite = Sprite.from(this.assets[layerName] ?? Texture.EMPTY);
                sprite.anchor.set(0, 0);
                sprite.x = lastSprite.x + lastSprite.width;
                sprite.y = lastSprite.y;
                sprite.zIndex = lastSprite.zIndex;
                this.scene.add(sprite);

                this.layers[layerName].push(sprite);

            }
        });


        if(screenWidth > GameConfig.finalLine_width){
            //move final line to the end of screen
            var diff = screenWidth - GameConfig.finalLine_width;
            this.finalLineSprite.x = diff;
            this.finalLineSprite.zIndex += 1;
            GameConfig.win_x += diff;

        }

    }

    public destroy(): void {
        for (const sprites of Object.values(this.layers)) {
            sprites.forEach(sprite => {
                sprite.parent?.removeChild(sprite);
                sprite.destroy();
            });
        }
        this.layers = {};
    }
}