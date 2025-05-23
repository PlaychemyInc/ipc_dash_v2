import { Assets, AnimatedSprite } from 'pixi.js';


export default class Rock {
    constructor(scene, x, y) {

        this.scene = scene;
        this.loadAssets(x, y);

        // this.portal.speed = 0.1;
        // this.portal.visible = false;
        // this.portal.anchor.set(0.5);
        // this.portal.scale.set(0.5);

        // this.scene.add(this.portal);

    }

    async loadAssets(x, y){
        const sheet = await Assets.load('assets/rock.json');
        this.rock = new AnimatedSprite(sheet.animations['break']);
        this.rock.x = x;
        this.rock.y = y;
        this.scene.add(this.rock);
    }

    getSprite(){
        return this.rock;
    }
}