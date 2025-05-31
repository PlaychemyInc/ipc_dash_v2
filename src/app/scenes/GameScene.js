// import { Container, Text } from 'pixi.js';
import { AnimatedSprite, Assets, Container, PI_2, Ticker } from 'pixi.js';

import { GAME, IPC_CONFIG } from '../config'
import Camera from '../components/Camera';
import UIManager from '../managers/UIManager';

import { Text, Sprite } from 'pixi.js';
import BasicScene from './BasicScene'
import IPCManager from '../managers/IPCManager.js';

import RockManager from '../managers/RockManager';
import DiceRollLog from '../components/DiceRollLog';

export default class gameScene extends BasicScene {
    constructor(game) {
        super(game, 'game-scene');
        this.scaleFactor = 1;


    }

    onLoadComplete() {


        this.addbackground();

        //Managers
        this.rockManager = GAME.rocks_enabled ? new RockManager(this) : null;
        this.diceRollLog = GAME.debug ? new DiceRollLog() : null;

        var ipcManagerConfig = {
            scene: this,
            rockManager: this.rockManager,
            diceRollLog: this.diceRollLog
        };
        this.ipcManager = new IPCManager(ipcManagerConfig);

        this.camera = new Camera(this, this.diceRollLog);

        //UI layer
        this.uiManager = new UIManager(this);
        this.add(this.uiManager.displayObject);
        this.addUIElements();
        this.uiManager.hideButtons();

        if (this.diceRollLog) { this.add(this.diceRollLog.displayObject); }



    }



    ipcLoaded(ipcSprite) {

    }

    async addIPCtoScene(id) {

        var ipc_id = parseInt(id);
        if (ipc_id >= 1 && ipc_id <= 12000) {

            this.uiManager.hidePopup();
            this.uiManager.showButtons();

            this.ipcManager.addIPC(ipc_id, this.ipcLoaded.bind(this));

            this.ensureFitsScreen(this.ipcManager.getMaxHieght());
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


    addUIElements() {
        this.uiManager.createPopup(this.getScreenWidth() / 2, this.getScreenHeight() / 2, this.addIPCtoScene.bind(this));

        this.ipcManager.addIpcButton = this.uiManager.createButton(10, 10, 'Add IPC', this.showPopup.bind(this));

        var buttonStart = this.uiManager.createButton(this.getScreenWidth() - 10, 10, 'Start Race', this.onStartRaceClicked.bind(this));
        buttonStart.x -= buttonStart.width;

        this.fastForwardButton = this.uiManager.createFastForwardButton(this.getScreenWidth() - 10, 10, this.increaseSpeed.bind(this));
        this.fastForwardButton.x -= this.fastForwardButton.width;
        this.add(this.fastForwardButton);
        this.fastForwardButton.visible = false;
        // this.camera.addToMoveWithCamera(this.fastForwardButton);
        this.camera.addToMoveWithCamera(this.uiManager.displayObject);

    }

    increaseSpeed() {
        IPC_CONFIG.base_speed += 1;
    }

    onStartRaceClicked() {
        this.uiManager.startRaceClicked(this.startRace.bind(this));
    }

    startRace() {
        this.ipcManager.startRace();
        this.camera.startFollowIPC(this.ipcManager, this.getScreenWidth(), 4096, this.scaleFactor, this.onRaceFinished.bind(this));
        this.fastForwardButton.visible = true;
    }

    onRaceFinished() {
        this.uiManager.showWinPopup();
    }

    showPopup() {
        // this.popup.visible = true;
        this.uiManager.hideButtons();
        this.uiManager.showPopup();
    }

    ensureFitsScreen(y) {
        if (y > this.getScreenHeight()) {
            // Calculate scale factor to fit y into screen height
            this.scaleFactor = this.getScreenHeight() / y; // scale = screenHeight / y  (scale down so y fits exactly)
            this.scene.scale.set(this.scaleFactor);
            // Optionally, you might want to reposition container too
            this.scene.position.set(0, 0);
            //fix ui layer
            this.uiManager.displayObject.scale.set(1 / this.scaleFactor);
        }
    }
}