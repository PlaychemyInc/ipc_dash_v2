import IpcModel from './IpcModel';
import IpcView from './IpcView';
import IpcController from './IpcController';

interface IPCConfig {
    id: number;
    x: number;
    y: number;
    spritesheetData: any;
    diceRollLog?: any;
    scene: any;
    callback: (ipc: IPC) => void;
}

export default class IPC {
    #ipcID: number;
    private model: IpcModel;
    private view: IpcView;
    private controller: IpcController;
    private callback: (ipc: IPC) => void;

    constructor(config: IPCConfig) {
        this.#ipcID = config.id;
        this.callback = config.callback;

        this.model = new IpcModel(config.id);
        this.view = new IpcView(config.x, config.y, this.model, config.spritesheetData, config.scene);
        this.controller = new IpcController(this.view, this.model, config.diceRollLog);
        this.view.controller = this.controller;

        this.init();
    }

    private async init(): Promise<void> {
        await Promise.all([
            this.model.loadData(),
            this.view.loadAssets()
        ]);

        this.view.onDataLoaded();
        this.callback(this);
    }

    public startRace(): void {
        this.controller.startRace();
    }

    public hitRock(rock: any): void {
        this.controller.hitRock(rock);
    }

    public getX(): number {
        return this.view.container.x;
    }

    public getWidth(): number {
        return this.view.container.width;
    }

    public get displayObject(): any {
        return this.view.displayObject;
    }

    public destroy(): void {
        this.controller.destroy();
        this.view.destroy();
        this.model.destroy();
    }
}
