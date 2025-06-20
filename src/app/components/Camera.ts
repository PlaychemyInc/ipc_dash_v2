import { Container, Ticker } from 'pixi.js';
import { GAME } from '../config'

import IPCManager from '../managers/IPCManager';
import GameScene from '../scenes/GameScene';

export default class Camera {

    private static _instance: Camera | null = null;
    private cameraContainer: Container;
    private scene: GameScene;
    private moveWithCamera: Container[] = [];
    private tickerFn: (() => void) | null = null;

    private constructor() {
        // private to prevent direct instantiation
    }

    /**
    * Initialize the singleton instance.
    * Must be called once before getInstance() can be used.
    */
    public static init(scene: GameScene): Camera {
        if (!Camera._instance) {
            Camera._instance = new Camera();
            Camera._instance.setup(scene);
        }
        return Camera._instance;
    }

    /**
     * Get the singleton instance.
     * Make sure init() has been called first.
     */
    public static getInstance(): Camera {
        if (!Camera._instance) {
            throw new Error("Camera has not been initialized. Call Camera.init(scene) first.");
        }
        return Camera._instance;
    }

    private setup(scene: GameScene): void {
        this.scene = scene;
        this.cameraContainer = this.scene.container;
        this.cameraContainer.pivot.set(0, 0);
    }

    startFollowIPC(
        ipcManager: IPCManager,
        maxWidth: number,
        finalX: number,
        scaleFactor: number,
        onRaceFinished: () => void
    ): void {

        maxWidth /= scaleFactor;

        this.tickerFn = () => {

            const fastestIPC = ipcManager.getFurthestIPC();
            if (!fastestIPC) return;

            let speed = 0;
            const ipcX = fastestIPC.getX();
            const ipcWidth = fastestIPC.getWidth() / (scaleFactor * 2);

            if (ipcX + ipcWidth >= this.cameraContainer.pivot.x + maxWidth) {
                speed = ipcX + ipcWidth - (this.cameraContainer.pivot.x + maxWidth) + GAME.ipc_camera_padding;
            }

            if (this.cameraContainer.pivot.x + maxWidth < finalX) {
                this.cameraContainer.pivot.x += speed;

                this.moveWithCamera.forEach(obj => {
                    obj.x += speed;
                });

                if (this.cameraContainer.pivot.x + maxWidth > finalX) {
                    this.cameraContainer.pivot.x = finalX - maxWidth;
                }

            }

            if (ipcManager.allIPCsFinished()) {
                onRaceFinished();
                this.stopFollow();
            }
        };

        Ticker.shared.add(this.tickerFn);
    }

    public stopFollow(): void {
        if (this.tickerFn) {
            Ticker.shared.remove(this.tickerFn);
            this.tickerFn = null;
        }
    }

    public addToMoveWithCamera(obj: Container): void {
        this.moveWithCamera.push(obj);
    }

    destroy() {
        // Remove ticker if set
        if (this.tickerFn) {
            Ticker.shared.remove(this.tickerFn);
            this.tickerFn = null;
        }

        // Clear moveWithCamera references
        this.moveWithCamera = [];

        // Destroy camera container if needed
        this.cameraContainer.destroy({ children: true });

        // Clear scene reference (optional, helps GC)
        (this.scene as any) = null;

        Camera._instance = null;
    }

}