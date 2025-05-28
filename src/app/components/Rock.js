import { Assets, AnimatedSprite } from 'pixi.js';

const RockHealth = 100;

export default class Rock {
    constructor(manager, ipc_id, x, y, callback) {

        this.manager = manager;
        this.loadAssets(x, y);
        this.ipc_id = ipc_id;
        this.callback = callback;
        this.health = RockHealth;

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

    takeDamage(damage){
        this.health -= damage;
        if(this.health > 80){
            this.sprite.gotoAndStop(1);
        }
        else if(this.health > 60){
            this.sprite.gotoAndStop(2);
        }
        else if(this.health > 40){
            this.sprite.gotoAndStop(3);
        }
        else if(this.health > 20){
            this.sprite.gotoAndStop(4);
        }
        else if(this.health > 0){
            this.sprite.gotoAndStop(5);
        }
        else{
            this.sprite.gotoAndStop(6);
        }
    }

    getSprite(){
        return this.sprite;
    }
}