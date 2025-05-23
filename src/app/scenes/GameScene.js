// import { Container, Text } from 'pixi.js';
import Camera from '../components/Camera';
import UILayer from '../components/UILayer';
import { AnimatedSprite, Assets, Container, PI_2, Ticker } from 'pixi.js';

import { Text, Sprite } from 'pixi.js';
import BasicScene from './BasicScene'
import IPCManager from '../managers/IPCManager.js';

export default class gameScene extends BasicScene {
    constructor(game) {
        super(game, 'game-scene');
        

    }

    onLoadComplete() {
        

        // this.addText();
        this.addbackground();

        //Managers
        this.ipcManager = new IPCManager(this, { x: 100, y: 600 });

        this.camera = new Camera(this);

        //UI layer
        this.uiLayer = new UILayer(this);
        this.addUIElements();
        this.uiLayer.hideButtons();

    }

    ipcLoaded(ipcSprite) {

    }

    async addIPCtoScene(ipc_id) {

        this.uiLayer.hidePopup();
        this.uiLayer.showButtons();

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

    addUIElements() {
        this.uiLayer.createPopup(this.getScreenWidth()/2, this.getScreenHeight()/2, this.addIPCtoScene.bind(this));

        this.ipcManager.addIpcButton = this.uiLayer.createButton(10, 10, 'Add IPC', this.showPopup.bind(this));

        var buttonStart = this.uiLayer.createButton(this.getScreenWidth() - 10, 10, 'Start Race', this.startRace.bind(this));
        buttonStart.x -= buttonStart.width;

    }

    startRace() {
        this.uiLayer.hideButtons();
        this.ipcManager.startRace();
        this.camera.startFollowIPC(this.ipcManager.getFastestIPC(), this.getScreenWidth(), 4096);
    }

    showPopup() {
        // this.popup.visible = true;
        this.uiLayer.hideButtons();
        this.uiLayer.showPopup();
    }

    ensureFitsScreen(y) {
        if (y > this.getScreenHeight()) {
            // Calculate scale factor to fit y into screen height
            const scaleFactor = this.getScreenHeight() / y; // scale = screenHeight / y  (scale down so y fits exactly)
            this.scene.scale.set(scaleFactor);
            // Optionally, you might want to reposition container too
            this.scene.position.set(0, 0);
            //fix ui layer
            this.uiLayer.ui.scale.set(1);
        }
    }
}