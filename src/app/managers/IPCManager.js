import { Spritesheet, Assets, Texture, AnimatedSprite } from 'pixi.js';
import IPC from '../components/IPC.js';

const ipcSpriteSheetPath = 'assets/IpcSpriteSheet.json';

export default class IPCManager {
    constructor(scene, startPos) {
        this.ipcArray = [];
        this.ipcStart = startPos;
        this.scene = scene;

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

        //https://github.com/AnnEsther/ipc_dash_page/blob/main/assets/IPCSpriteSheets/1.png
        //https://raw.githubusercontent.com/AnnEsther/ipc_dash_page/main/assets/IPCSpriteSheets/1.png
        this.imageURL = 'https://raw.githubusercontent.com/AnnEsther/ipc_dash_page/main/assets/IPCSpriteSheets/' + ipc_id + '.png';
        // this.imageURL = 'assets/IPCSpriteSheets/' + ipc_id + '.png';

        //Load your alternate image (according to gameData)
        this.ipcSheetData.meta.image = this.imageURL;
        // Step 3: Create your own spritesheet
        // Step 4: Parse it (builds textures)
        await Assets.load(this.imageURL);
        const spritesheet = new Spritesheet(Texture.from(this.imageURL), this.ipcSheetData);
        await spritesheet.parse();

        var newIPC = new IPC(spritesheet, ipc_id, this.ipcStart.x, this.ipcStart.y, this.onSpriteLoaded.bind(this));
        this.ipcArray.push(newIPC);
        this.ipcStart.y += 130;

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

    onSpriteLoaded(ipcSprite) {
        this.stopPortal();

        this.scene.add(ipcSprite);
    }

    getMaxHieght() {
        return this.ipcStart.y + 130;
    }

    getNextIpcPos() {
        return this.ipcStart;
    }

    startRace() {
        for (const index in this.ipcArray) {
            this.ipcArray[index].startRace();
        }
    }

    getFastestIPC() {

        let maxX = -Infinity;
        var fastestIPC;
        for (const ipc of this.ipcArray) {
            if(maxX < ipc.x){
                maxX = ipc.x;
                fastestIPC = ipc;
            }
        }
        return fastestIPC;
    }
}