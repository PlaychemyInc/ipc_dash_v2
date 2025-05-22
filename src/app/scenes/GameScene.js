// import { Container, Text } from 'pixi.js';
import BasicPopup from '../components/BasicPopup';
import { AnimatedSprite, Assets, Container } from 'pixi.js';
import { FancyButton } from '@pixi/ui';

import { Text, Sprite } from 'pixi.js';
import BasicScene from './BasicScene'
import IPCManager from '../managers/IPCManager.js';


export default class gameScene extends BasicScene {
    constructor(game) {
        super(game, 'game-scene');
        
    }

    onLoadComplete() {

        //UI layer
        this.uiLayer = new Container();
        this.uiLayer.visible = false;
        this.game.app.stage.addChild(this.uiLayer); // Add after world to render on top

        // this.addText();
        this.addbackground();

        //Managers
        this.ipcManager = new IPCManager(this, { x: 100, y: 600 });

        this.popup = new BasicPopup(this.game.app, "Add your IPC", this.addIPCtoScene.bind(this));
        this.add(this.popup);
        this.popup.zIndex = 1000;

        this.addUIbutton();

    }

    ipcLoaded(ipcSprite) {

    }

    async addIPCtoScene(ipc_id) {

        this.popup.visible = false;
        this.uiLayer.visible = true;

        this.ipcManager.addIPC(ipc_id, this.ipcLoaded.bind(this));

        this.ensureFitsScreen(this.ipcManager.getMaxHieght());

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

        this.addIPCButton.x = 10;
        this.addIPCButton.y = 10;//this.addIPCButton.height/2;

        this.addIPCButton.onPress.connect(this.showPopup.bind(this));

        this.uiLayer.addChild(this.addIPCButton);




        this.startRaceButton = new FancyButton({
            defaultView: Sprite.from(this.assets['button']),
            hoverView: Sprite.from(this.assets['button_hover']),
            pressedView: Sprite.from(this.assets['button_pressed']),
            text: 'Start Race',
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

        this.startRaceButton.x = this.getScreenWidth() - this.startRaceButton.width - 10;
        this.startRaceButton.y = 10;//this.addIPCButton.height/2;

        // this.addIPCButton.onPress.connect(this.showPopup.bind(this));

        this.uiLayer.addChild(this.startRaceButton);




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