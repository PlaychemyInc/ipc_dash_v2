import { Spritesheet, Assets, Texture, AnimatedSprite } from 'pixi.js';
import {GAME} from '../config'
import IPC from '../components/IPC.js';

const ipcSpriteSheetPath = 'assets/IpcSpriteSheet.json';

export default class IPCManager {
    constructor(config) {

        this.scene = config.scene;
        this.rockManager = config.rockManager;
        this.diceRollLog = config.diceRollLog;
        
        this.ipcStart = GAME.ipc_start;
        this.ipcArray = {};

        this.loadPortalAssets();
        this.loadIpcSpriteJson();
    }

    async loadIpcSpriteJson() {
        // Load the JSON as raw data
        const response = await fetch(ipcSpriteSheetPath);
        this.ipcSheetData = await response.json();
    }

    async loadPortalAssets() {
        const sheet = await Assets.load('assets/PortalSpriteSheet.json');
        this.portal = new AnimatedSprite(sheet.animations['portal']);

        // this.portal.speed = 0.1;
        this.portal.visible = false;
        this.portal.anchor.set(0.5);
        this.portal.scale.set(0.5);

        this.scene.add(this.portal);
    }

    async addIPC(ipc_id, callback) {

        this.callback = callback;

        this.startPortal();

        var ipcConfig = {
            spritesheetData :  this.ipcSheetData,
            id : ipc_id,
            x : this.ipcStart.x,
            y: this.ipcStart.y,
            callback: this.onIpcLoaded.bind(this),
            diceRollLog: this.diceRollLog,
            scene: this.scene
        };
        var newIPC = new IPC(ipcConfig);
        this.ipcArray[ipc_id] = newIPC;
        this.ipcStart.y += 150;

        if(this.ipcStart.y > 4096){
            this.addIpcButton.visible = false;
        }

    }

    startPortal() {
        this.portal.x = this.ipcStart.x;
        this.portal.y = this.ipcStart.y;
        this.portal.visible = true;
        this.portal.play();
    }

    stopPortal() {
        this.portal.visible = false;
        this.portal.stop();
    }

    onIpcLoaded(ipc) {
        this.stopPortal();
        if(this.rockManager){
            this.rockManager.createRocks(ipc);
        }
        // ipc.displayObject.zIndex = 1000;
        this.scene.add(ipc.displayObject);
    }

    getMaxHieght() {
        return this.ipcStart.y + 130;
    }

    getNextIpcPos() {
        return this.ipcStart;
    }

    startRace() {
        for (const index in this.ipcArray) {
            this.ipcArray[index].controller.startRace();
        }
    }

    getFastestIPC() {

        let maxX = -Infinity;
        var fastestIPC;
        for (var ipc_id in this.ipcArray) {
            if(maxX < this.ipcArray[ipc_id].x){
                maxX = this.ipcArray[ipc_id].x;
                fastestIPC = this.ipcArray[ipc_id];
            }
        }
        return fastestIPC;
    }

    getIPC(ipc_id){
        return this.ipcArray[ipc_id];
    }

    getFurthestIpc(){
        var furthestIPC = null;
        for (var ipc_id in this.ipcArray) {
            if(furthestIPC){
                if (furthestIPC.getX() < this.ipcArray[ipc_id].getX()){
                    furthestIPC = this.ipcArray[ipc_id];
                }
            }
            else {
                furthestIPC = this.ipcArray[ipc_id];
            }
        }
        return furthestIPC;
    }
}