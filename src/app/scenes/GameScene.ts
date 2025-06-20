import { Container, Sprite } from 'pixi.js';
import { GameConfig } from '../config';
import BasicScene from './BasicScene';
import Camera from '../components/Camera';
import UIManager from '../managers/UIManager';
import IPCManager from '../managers/IPCManager';
import RockManager from '../managers/RockManager';
import BackgroundManager from '../managers/BackgroundManager';
import { FancyButton } from '@pixi/ui';

export default class GameScene extends BasicScene {
    private backgroundManager!: BackgroundManager;
    private camera!: Camera;
    private rockManager!: RockManager | null;
    private fastForwardButton!: FancyButton;
    scaleFactor: number;

    constructor(game: any) {
        super(game, 'game-scene');
        this.scaleFactor = 1;
        GameConfig.base_speed = 1;
        GameConfig.ipc_start = { x: 100, y: 600 };
    }

    public async onLoadComplete(): Promise<void> {
        this.backgroundManager = new BackgroundManager(this, this.assets);

        this.rockManager = GameConfig.rocks_enabled ? new RockManager(this) : null;

        const ipcManager = IPCManager.getInstance({
            scene: this,
            rockManager: this.rockManager,
        });
        await ipcManager.init();

        Camera.init(this);

        UIManager.init(this);

        this.add(UIManager.getInstance().displayObject);

        UIManager.getInstance().createAddIPCPopup(this.addMultipleIPCsToScene.bind(this));

        const buttonStart = UIManager.getInstance().createStartRaceButton(this.getScreenWidth() - 10, 10, 'Start Race', this.onStartRaceClicked.bind(this), this.onStartRaceQuick.bind(this));
        buttonStart.x -= buttonStart.width;


        this.fastForwardButton = UIManager.getInstance().createFastForwardButton(
            this.getScreenWidth() - 10,
            10,
            this.increaseSpeed.bind(this)
        );
        this.fastForwardButton.x -= this.fastForwardButton.width;
        this.fastForwardButton.visible = false;

        Camera.getInstance().addToMoveWithCamera(UIManager.getInstance().displayObject);

        UIManager.getInstance().hideButtons();

        // if (this.diceRollLog) {
        //     this.add(this.diceRollLog.displayObject);
        // }
    }

    async addIPCtoScene(id: string) {

        var ipc_id = parseInt(id);
        if (ipc_id >= 1 && ipc_id <= 12000) {

            UIManager.getInstance().hidePopup();
            UIManager.getInstance().showButtons();

            IPCManager.getInstance().addIPC(ipc_id);

            this.ensureFitsScreen(IPCManager.getInstance().getMaxHeight());
        }

    }

    async addMultipleIPCsToScene(ids) {

        UIManager.getInstance().hidePopup();
        UIManager.getInstance().showButtons();

        for (var id in ids) {
            var ipc_id = parseInt(ids[id]);
            IPCManager.getInstance().addIPC(ipc_id);
        }

        this.ensureFitsScreen(IPCManager.getInstance().getMaxHeight());

    }

    ensureFitsScreen(y) {
        if (y > this.getScreenHeight()) {
            // Calculate scale factor to fit y into screen height
            this.scaleFactor = this.getScreenHeight() / y; // scale = screenHeight / y  (scale down so y fits exactly)
            this.container.scale.set(this.scaleFactor);
            // Optionally, you might want to reposition container too
            this.container.position.set(0, 0);
            //fix ui layer
            UIManager.getInstance().displayObject.scale.set(1 / this.scaleFactor);
        }
    }

    onStartRaceClicked() {
        IPCManager.getInstance().startRace();
        Camera.getInstance().startFollowIPC(IPCManager.getInstance(), this.getScreenWidth(), 4096, this.scaleFactor, this.onRaceFinished.bind(this));
        this.fastForwardButton.visible = true;
    }


    onStartRaceQuick() {
        UIManager.getInstance().hideButtons();
        this.onStartRaceClicked();
    }

    increaseSpeed() {
        GameConfig.base_speed += 1;
    }

    onRaceFinished() {
    }


    public destroy(): void {
        // IPCManager.getInstance().destroy();
        UIManager.getInstance().destroy();
        this.backgroundManager.destroy();
        this.rockManager?.destroy?.();
        Camera.getInstance().destroy();
        // super.destroy();
    }


    // Other methods (addIPCtoScene, startRace, etc.) remain as is
}
