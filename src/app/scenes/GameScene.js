// import { Container, Text } from 'pixi.js';
// import BasicButton from '../components/BasicButton';
import BasicPopup from '../components/BasicPopup';
// import { Tilemap, CompositeTilemap } from '@pixi/tilemap';

// import * as PIXI from 'pixi.js';
// var stage = null;
// var renderer = null;
// var renderWidth = 800;
// var renderHeight = 600;
// var tilemap = null;



// export default function createGameScene(app, switchScene) {
//     const scene = new PIXI.Container();

//     // const button = new BasicButton('Show Popup', 200, 60, () => {
//     //     const popup = new BasicPopup(app, 'This is a popup!', () => console.log('Closed'));
//     //     app.stage.addChild(popup);
//     // });
//     // button.x = 100;
//     // button.y = 100;
//     // scene.addChild(button);




//     // const style = {
//     //     fill: 0xffffff,
//     //     fontSize: 32,
//     // };
//     // const text = new Text({
//     //     text: ' Game Scene - Click to Go Back',
//     //     style
//     // });

//     // text.anchor.set(0.5);
//     // text.x = app.screen.width / 2;
//     // text.y = app.screen.height / 2;
//     // text.eventMode = 'static';
//     // text.cursor = 'pointer';
//     // text.on('pointerdown', () => switchScene('menu'));
//     // scene.addChild(text);


//     addSprite(app.stage, 'sky', 0, 0);

//     return scene;
// }


// function addSprite(stage, key, x, y) {

//     // Create sprite from the texture
//     const sprite = new Sprite(key);

//     // Anchor at top-left corner (0,0) is default, but let's be explicit
//     sprite.anchor.set(0, 0);

//     // Position sprite at (0,0)
//     sprite.x = 0;
//     sprite.y = 0;

//     // Add sprite to stage
//     app.stage.addChild(sprite);
// }

import { Text, Sprite } from 'pixi.js';
import BasicScene from './BasicScene'

export default class gameScene extends BasicScene {
    constructor(game) {
        super(game, 'game-scene');
    }

    onLoadComplete() {

        this.addText();
        this.addbackground();

        const popup = new BasicPopup(this.app, "Add your IPC");
        this.add(popup);


    }

    addBgImage(key){
        const sprite = Sprite.from(this.assets[key]);
        sprite.anchor.set(0, 0);
        sprite.x = 0;
        sprite.y = 0;
        this.add(sprite);
        return sprite;
    }

    addbackground(){
        this.sky = this.addBgImage('sky');
        this.mountains = this.addBgImage('mountains');
        this.trees = this.addBgImage('trees');
        this.grass = this.addBgImage('grass');
        this.water = this.addBgImage('water');
        this.topItems = this.addBgImage('topItems');
    }

    addText() {
        const style = {
            fill: 0xffffff,
            fontSize: 32,
        };
        const title = new Text({
            text: 'Game Scene - Click to go back',
            style
        });
        title.anchor.set(0.5);
        title.x = this.app.screen.width / 2;
        title.y = this.app.screen.height / 2;
        title.eventMode = 'static';
        title.cursor = 'pointer';

        title.on('pointerdown', () => this.setScene('init'));

        this.add(title)
    }
}