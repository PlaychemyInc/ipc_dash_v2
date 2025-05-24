import { Assets, AnimatedSprite } from 'pixi.js';


export default class Rock {
    constructor(manager, ipc_id, x, y, callback) {

        this.manager = manager;
        this.loadAssets(x, y);
        this.ipc_id = ipc_id;
        this.callback = callback;

        // this.portal.speed = 0.1;
        // this.portal.visible = false;
        // this.portal.anchor.set(0.5);
        // this.portal.scale.set(0.5);

        // this.scene.add(this.portal);

    }

    async loadAssets(x, y){
        const sheet = await Assets.load('assets/rock.json');
        this.sprite = new AnimatedSprite(sheet.animations['break']);
        this.sprite.x = x;
        this.sprite.y = y;
        this.sprite.speed = 0.1;
        this.sprite.scale.set(2,2);
        this.callback(this.ipc_id, this.sprite);
        // this.scene.add(this.rock);
    }

    getSprite(){
        return this.sprite;
    }
}