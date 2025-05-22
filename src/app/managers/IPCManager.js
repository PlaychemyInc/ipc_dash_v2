import { Spritesheet, Assets, Texture, AnimatedSprite } from 'pixi.js';
import IPC from '../components/IPC.js';

const ipcSpriteSheetPath = 'assets/IpcSpriteSheet.json';

export default class IPCManager {
    constructor(startPos) {
        this.ipcArray = [];
        this.ipcStart = startPos;

        this.loadIpcSpriteJson();
    }

    async loadIpcSpriteJson() {
        // Load the JSON as raw data
        const response = await fetch(ipcSpriteSheetPath);
        this.ipcSheetData = await response.json();
    }

    async addIPC(ipc_id, callback) {
        this.imageURL = 'assets/IPCSpriteSheets/' + ipc_id + '.png';

        //Load your alternate image (according to gameData)
        this.ipcSheetData.meta.image = this.imageURL;
        await Assets.load(this.imageURL);
        // Step 3: Create your own spritesheet
        const spritesheet = new Spritesheet(Texture.from(this.imageURL), this.ipcSheetData);
        // Step 4: Parse it (builds textures)
        await spritesheet.parse();

        var newIPC = new IPC(spritesheet, ipc_id, this.ipcStart.x, this.ipcStart.y, callback);
        this.ipcArray.push(newIPC);
        this.ipcStart.y += 130;
    }

    getMaxHieght() {
        return this.ipcStart.y + 130;
    }

    getNextIpcPos() {
        return this.ipcStart;
    }
}