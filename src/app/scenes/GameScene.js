// import { Container, Text } from 'pixi.js';
// import BasicButton from '../components/BasicButton';
import BasicPopup from '../components/BasicPopup';
import { AnimatedSprite, Spritesheet, Graphics, Assets, Texture, Container } from 'pixi.js';
import { Button } from '@pixi/ui';

import { Text, Sprite } from 'pixi.js';
import BasicScene from './BasicScene'

const ipcSpriteSheetPath = 'assets/IpcSpriteSheet.json';
const ipcSpritesPath = 'assets/IPCSpriteSheets/';

export default class gameScene extends BasicScene {
    constructor(game) {
        super(game, 'game-scene');
        this.ipcStartPosition = {x:100, y:600};
    }

    onLoadComplete() {

        //UI layer
        this.uiLayer = new Container();
        this.uiLayer.visible = false;
        this.game.app.stage.addChild(this.uiLayer); // Add after world to render on top

        this.addText();
        this.addbackground();

        this.popup = new BasicPopup(this.game.app, "Add your IPC", this.addIPCtoScene.bind(this));
        this.add(this.popup);
        this.popup.zIndex = 1000;

        this.addUIbutton();

    }


    async addIPCtoScene(ipc_id) {
        
        this.popup.visible = false;
        this.uiLayer.visible = true;


        // Load the JSON as raw data
        const response = await fetch(ipcSpriteSheetPath);
        const sheetData = await response.json();

        // Step 2: Load your alternate image (according to gameData)
        const imagePath = ipcSpritesPath + ipc_id + '.png';
        sheetData.meta.image = imagePath;

        await Assets.load(imagePath);

        // Step 3: Create your own spritesheet
        const spritesheet = new Spritesheet(Texture.from(sheetData.meta.image), sheetData);

        // Step 4: Parse it (builds textures)
        await spritesheet.parse();

        const scaling = 0.5;

        // Create a  AnimatedSprite
        const animatedSprite = new AnimatedSprite(spritesheet.animations.ipc);

        animatedSprite.anchor.set(0.5);
        animatedSprite.scale.set(scaling);
        animatedSprite.animationSpeed = 0.5;
        animatedSprite.x = this.ipcStartPosition.x;
        animatedSprite.y = this.ipcStartPosition.y;
        this.ipcStartPosition.y += 130;

        //fix cameraZoom
        this.ensureFitsScreen(this.ipcStartPosition.y);

        animatedSprite.play();
        this.add(animatedSprite);
    }

    updateScreenSize() {

    }

    addBgImage(key) {
        const sprite = Sprite.from(this.assets[key]);
        sprite.anchor.set(0, 0);
        sprite.x = 0;
        sprite.y = 0;
        this.add(sprite);
        return sprite;
    }

    addbackground() {
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
        title.x = this.getScreenWidth() / 2;
        title.y = this.getScreenHeight() / 2;
        title.eventMode = 'static';
        title.cursor = 'pointer';

        title.on('pointerdown', () => this.setScene('init'));

        this.add(title)
    }

    addUIbutton() {

        var padding = { x: 10, y: 10 };
        
        const style = { fill: 0x000000, fontSize: 32, };
        const title = new Text({ text: 'Add IPC', style });
        title.x = this.getScreenWidth() - title.width - padding.x - padding.x;
        title.y =  2*padding.y;


        var width = title.width + (2*padding.x);
        var height = 50;
        const button = new Button(
            new Graphics()
                .rect( this.getScreenWidth() - width - padding.x ,0 + padding.y,width, height, 15)
                .fill(0xFFFFFF)
        );
        button.onPress.connect(this.showPopup.bind(this));
        
        this.uiLayer.addChild(button.view);
        this.uiLayer.addChild(title)
    }

    showPopup(){
        this.popup.visible = true;
        this.uiLayer.visible = false;
    }

    ensureFitsScreen(y) {
    if (y > this.getScreenHeight()) {
        // Calculate scale factor to fit y into screen height
        // scale = screenHeight / y  (scale down so y fits exactly)
        const scaleFactor = this.getScreenHeight() / y;
        // Apply uniform scale to zoom out
        this.scene.scale.set(scaleFactor);
        // Optionally, you might want to reposition container too
        // For example, keep container at top-left (0,0)
        this.scene.position.set(0, 0);
    } 
}
}