import { AnimatedSprite, Assets } from 'pixi.js';
import { GAME } from '../config';
import IPC from '../components/IPC';
import UIManager from './UIManager';

const IPC_SPRITE_SHEET_PATH = 'assets/IpcSpriteSheet.json';
const PORTAL_SPRITE_SHEET_PATH = 'assets/PortalSpriteSheet.json';

interface IPCManagerConfig {
    scene: any;
    rockManager?: any;
    diceRollLog?: any;
}

export default class IPCManager {
    private static _instance: IPCManager | null = null;

    private scene!: any;
    private rockManager?: any;
    private diceRollLog?: any;
    private ipcStart = { ...GAME.ipc_start };
    private ipcArray: Record<number, IPC> = {};
    private finishedIPCs: any[] = [];
    private ipcSheetData: any;
    private portal!: AnimatedSprite;

    private constructor() {
        // Private to prevent direct instantiation
    }

    /**
     * Get the singleton instance of IPCManager
     */
    public static getInstance(config?: IPCManagerConfig): IPCManager {
        if (!IPCManager._instance) {
            if (!config) {
                throw new Error("IPCManager requires config for first initialization.");
            }
            IPCManager._instance = new IPCManager();
            IPCManager._instance.setup(config);
        }
        return IPCManager._instance;
    }

    private setup(config: IPCManagerConfig): void {
        this.scene = config.scene;
        this.rockManager = config.rockManager;
        this.diceRollLog = config.diceRollLog;
        this.ipcStart = { ...GAME.ipc_start };
    }

    public async init(): Promise<void> {
        await Promise.all([
            this.loadIpcSpriteJson(),
            this.loadPortalAssets()
        ]);
    }

    private async loadIpcSpriteJson(): Promise<void> {
        const response = await fetch(IPC_SPRITE_SHEET_PATH);
        this.ipcSheetData = await response.json();
    }

    private async loadPortalAssets(): Promise<void> {
        const sheet = await Assets.load(PORTAL_SPRITE_SHEET_PATH);
        this.portal = new AnimatedSprite(sheet.animations['portal']);
        this.portal.visible = false;
        this.portal.anchor.set(0.5);
        this.portal.scale.set(0.5);
        this.scene.add(this.portal);
    }

    public async addIPC(ipcId: number): Promise<void> {
        this.startPortal();

        const ipcConfig = {
            spritesheetData: this.ipcSheetData,
            id: ipcId,
            x: this.ipcStart.x,
            y: this.ipcStart.y,
            callback: this.onIpcLoaded.bind(this),
            diceRollLog: this.diceRollLog,
            scene: this.scene
        };

        const newIPC = new IPC(ipcConfig);
        this.ipcArray[ipcId] = newIPC;
        this.ipcStart.y += 150;

        if (this.ipcStart.y > 4096) {
            UIManager.getInstance().hideAddIpcButton();
        }
    }

    private startPortal(): void {
        if (!this.portal) {
            console.warn("Portal is not initialized. Did you forget to call init()?");
            return;
        }
        this.portal.x = this.ipcStart.x;
        this.portal.y = this.ipcStart.y;
        this.portal.visible = true;
        this.portal.play();
    }

    private stopPortal(): void {
        this.portal.visible = false;
        this.portal.stop();
    }

    private onIpcLoaded(ipc: IPC): void {
        this.stopPortal();
        this.rockManager?.createRocks(ipc);
        this.scene.add(ipc.displayObject);
    }

    public getMaxHeight(): number {
        return this.ipcStart.y + 130;
    }

    public startRace(): void {
        Object.values(this.ipcArray).forEach(ipc => ipc.startRace());
    }

    public getFurthestIPC(): IPC | null {
        let furthest: IPC | null = null;
        Object.values(this.ipcArray).forEach(ipc => {
            if (!furthest || ipc.getX() > furthest.getX()) {
                furthest = ipc;
            }
        });
        return furthest;
    }

    public allIPCsFinished(): boolean {
        return this.finishedIPCs.length === Object.keys(this.ipcArray).length;
    }

    public notifyFinished(ipcView: any): void {
        this.finishedIPCs.push(ipcView);

        const total = Object.keys(this.ipcArray).length;
        if (this.finishedIPCs.length === 3 || this.finishedIPCs.length === total) {
            const winnerData = this.finishedIPCs.slice(0, 3).map((ipc, index) => ({
                name: `Runner ${String.fromCharCode(65 + index)}`,
                texture: 'Portal',
                rank: index + 1,
                successRate: 90 - index * 7
            }));

            UIManager.getInstance().createWinPopup(this.finishedIPCs.slice(0, 3));
        }
    }

    public destroyIPCs(): void {
        // Destroy each IPC
        Object.values(this.ipcArray).forEach(ipc => {
            ipc.destroy();
        });

        // Reset arrays and references
        this.ipcArray = {};
        this.finishedIPCs = [];

    }

    public destroy(): void {
        this.portal?.destroy();
        Object.values(this.ipcArray).forEach(ipc => ipc.destroy?.());
        this.ipcArray = {};
        this.finishedIPCs = [];
        IPCManager._instance = null;
    }
}
