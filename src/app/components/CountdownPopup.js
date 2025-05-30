import { Container, Sprite, Text, AnimatedSprite, Ticker, Assets, Spritesheet, Texture } from 'pixi.js';
import { delay } from '../Utitlity';

export default class CountdownPopup{
    constructor(x, y, onLoadComplete){
        this.x = x;
        this.y = y;
        this.callback = onLoadComplete;
        this.loadAssets();
        
    }

    async loadAssets(){
        const sheet = await Assets.load('assets/UI/countdownBanner.json');
        this.sprite = new AnimatedSprite(sheet.animations['countdownBanner']);

        // this.portal.speed = 0.1;
        this.sprite.visible = false;
        this.sprite.anchor.set(0.5);
        this.sprite.x = this.x;
        this.sprite.y = this.y;
        // this.sprite.play();
        // this.portal.scale.set(0.5);

        this.callback();

    }

    async playAnimation(callback){

        this.onAnimationCompleted = callback;
        this.sprite.visible = true;
        this.sprite.animationSpeed = 0.05;
        this.sprite.loop = false;
        this.sprite.play();
        this.sprite.onComplete = this.animationComplete.bind(this);

    }

    animationComplete(){
        this.sprite.visible = false;
        this.onAnimationCompleted();
    }

    get displayObject() {
        return this.sprite;
    }
}