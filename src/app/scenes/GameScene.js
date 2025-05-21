// import { Container, Text } from 'pixi.js';
import BasicPopup from '../components/BasicPopup';
import { AnimatedSprite, Spritesheet, Graphics, Assets, Texture, Container } from 'pixi.js';
import { FancyButton } from '@pixi/ui';

import { Text, Sprite } from 'pixi.js';
import BasicScene from './BasicScene'
import IPC from '../components/IPC';

const ipcSpriteSheetPath = 'assets/IpcSpriteSheet.json';
const ipcSpritesPath = 'assets/IPCSpriteSheets/';


export default class gameScene extends BasicScene {
    constructor(game) {
        super(game, 'game-scene');
        this.ipcStartPosition = { x: 100, y: 600 };
    }

    onLoadComplete() {

        //UI layer
        this.uiLayer = new Container();
        this.uiLayer.visible = false;
        this.game.app.stage.addChild(this.uiLayer); // Add after world to render on top

        // this.addText();
        this.addbackground();

        this.popup = new BasicPopup(this.game.app, "Add your IPC", this.addIPCtoScene.bind(this));
        this.add(this.popup);
        this.popup.zIndex = 1000;

        this.addUIbutton();

        this.addPortal();

        this.loadIpcJson();

    }

    async loadIpcJson() {
        // Load the JSON as raw data
        const response = await fetch(ipcSpriteSheetPath);
        this.ipcSheetData = await response.json();
    }

    async addPortal() {
        const sheet = await Assets.load('assets/PortalSpriteSheet.json');
        this.portal = new AnimatedSprite(sheet.animations['portal']);
        this.add(this.portal);
        this.portal.visible = false;
        // this.portal.speed = 0.1;
        this.portal.anchor.set(0.5);
        this.portal.scale.set(0.5);
    }

    async startPortal() {
        if (this.portal) {
            this.portal.x = this.ipcStartPosition.x;
            this.portal.y = this.ipcStartPosition.y;
            this.portal.visible = true;
            this.portal.play();
        }
    }

    stopPortal() {
        if (this.portal) {
            this.portal.visible = false;
            this.portal.stop();
        }
    }

    ipcLoaded(ipcSprite) {
        this.stopPortal();
        this.add(ipcSprite);
    }

    async addIPCtoScene(ipc_id) {

        this.popup.visible = false;
        this.uiLayer.visible = true;

        this.startPortal();


        var newIPC = new IPC(this, ipc_id, this.ipcStartPosition.x, this.ipcStartPosition.y, this.ipcLoaded.bind(this));
        // this.add(newIPC);
        this.ipcStartPosition.y += 130;

        if (0) {

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

        this.addIPCButton = new FancyButton({
            defaultView: Sprite.from(this.assets['button']),
            hoverView: Sprite.from(this.assets['button_hover']),
            pressedView: Sprite.from(this.assets['button_pressed']),
            text: 'Add IPC',
            animations: {
                hover: {
                    props: { scale: { x: 1.02, y: 1.02, } },
                    duration: 100,
                },
                pressed: {
                    props: { scale: { x: 1, y: 1, } },
                    duration: 100,
                }
            }
        });

        this.addIPCButton.x = this.getScreenWidth() - this.addIPCButton.width - 10;
        this.addIPCButton.y = 10;//this.addIPCButton.height/2;

        this.addIPCButton.onPress.connect(this.showPopup.bind(this));

        this.uiLayer.addChild(this.addIPCButton);
    }

    showPopup() {
        this.popup.visible = true;
        this.uiLayer.visible = false;
    }

    ensureFitsScreen(y) {
        if (y > this.getScreenHeight()) {
            // Calculate scale factor to fit y into screen height
            const scaleFactor = this.getScreenHeight() / y; // scale = screenHeight / y  (scale down so y fits exactly)
            this.scene.scale.set(scaleFactor);
            // Optionally, you might want to reposition container too
            this.scene.position.set(0, 0);
        }
    }
}