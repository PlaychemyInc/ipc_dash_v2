import { Container, Sprite } from 'pixi.js';
import { GAME, IPC_CONFIG } from '../config';
import BasicScene from './BasicScene';
import Camera from '../components/Camera';
import UIManager from '../managers/UIManager';
import IPCManager from '../managers/IPCManager';
import RockManager from '../managers/RockManager';
import BackgroundManager from '../managers/BackgroundManager';
import GameControls from '../components/GameControls';

export default class GameScene extends BasicScene {
    private backgroundManager!: BackgroundManager;
    private camera!: Camera;
    private uiManager!: UIManager;
    private controls!: GameControls;
    private rockManager!: RockManager | null;
    private fastForwardButton!: Sprite;
    scaleFactor: number;

    constructor(game: any) {
        super(game, 'game-scene');
        this.scaleFactor = 1;
        IPC_CONFIG.base_speed = 1;
        GAME.ipc_start = { x: 100, y: 600 };
    }

    public async onLoadComplete(): Promise<void> {
        this.backgroundManager = new BackgroundManager(this, this.assets);

        this.rockManager = GAME.rocks_enabled ? new RockManager(this) : null;

        const ipcManager = IPCManager.getInstance({
            scene: this,
            rockManager: this.rockManager,
            // diceRollLog: this.diceRollLog
        });
        await ipcManager.init();

        Camera.init(this);

        this.uiManager = new UIManager(this);
        GAME.uiManager = this.uiManager;

        this.add(this.uiManager.displayObject);
        this.controls = new GameControls(this, this.uiManager);

        this.uiManager.hideButtons();

        // if (this.diceRollLog) {
        //     this.add(this.diceRollLog.displayObject);
        // }
    }

    async addIPCtoScene(id: string) {

        var ipc_id = parseInt(id);
        if (ipc_id >= 1 && ipc_id <= 12000) {

            this.uiManager.hidePopup();
            this.uiManager.showButtons();

            IPCManager.getInstance().addIPC(ipc_id);

            this.ensureFitsScreen(IPCManager.getInstance().getMaxHeight());
        }

    }

    async addMultipleIPCsToScene(ids) {

        this.uiManager.hidePopup();
        this.uiManager.showButtons();

        for (var id in ids) {
            var ipc_id = parseInt(ids[id]);
            IPCManager.getInstance().addIPC(ipc_id);
        }

        this.ensureFitsScreen(IPCManager.getInstance().getMaxHeight());

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
            this.container.scale.set(this.scaleFactor);
            // Optionally, you might want to reposition container too
            this.container.position.set(0, 0);
            //fix ui layer
            this.uiManager.displayObject.scale.set(1 / this.scaleFactor);
        }
    }

    onStartRaceClicked() {
        this.uiManager.startRaceClicked(this.startRace.bind(this));
    }

    startRace() {
        IPCManager.getInstance().startRace();
        Camera.getInstance().startFollowIPC(IPCManager.getInstance(), this.getScreenWidth(), 4096, this.scaleFactor, this.onRaceFinished.bind(this));
        this.fastForwardButton.visible = true;
    }

    onStartRaceQuick() {
        this.uiManager.hideButtons();
        this.startRace();
    }

    increaseSpeed() {
        IPC_CONFIG.base_speed += 1;
    }

    onRaceFinished() {
    }


    public destroy(): void {
        // IPCManager.getInstance().destroy();
        // this.uiManager.destroy();
        this.backgroundManager.destroy();
        this.controls.destroy();
        this.rockManager?.destroy?.();
        Camera.getInstance().destroy();
        // super.destroy();
    }


    // Other methods (addIPCtoScene, startRace, etc.) remain as is
}
