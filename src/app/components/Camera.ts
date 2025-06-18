import { Container, Ticker } from 'pixi.js';
import { IPC_CONFIG, GAME } from '../config'

import IPCManager from '../managers/IPCManager';
import DiceRollLog from './DiceRollLog';
import GameScene from '../scenes/GameScene';

export default class Camera {

    private cameraContainer: Container;
    private scene: GameScene;
    private diceRollLog: DiceRollLog | null;
    private moveWithCamera: Container[] = [];
    private tickerFn: (() => void) | null = null;

    constructor(gameScene, diceRollLog) {
        this.scene = gameScene;
        this.diceRollLog = diceRollLog;
        this.cameraContainer = this.scene.container;

        // this.camera = gameScene.scene;
        // this.diceRollLog = diceRollLog;

        // this.moveWithCamera = [];

        // Ensure pivot starts at (0,0)
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
        // var speed = 0;
        // const camera = this.camera;

        this.tickerFn = () => {

            const fastestIPC = ipcManager.getFurthestIpc();
            if (!fastestIPC) return;

            let speed = 0;
            const ipcX = fastestIPC.getX();
            const ipcWidth = fastestIPC.view.sprite.width / (scaleFactor * 2);

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

                this.diceRollLog?.updateX(this.cameraContainer.pivot.x);
            }
            
            if (ipcManager.allIpcsFinished()) {
                console.log("Race Finished!");
                onRaceFinished();
                this.stopFollow();
            }
        };

        // Start the movement
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

}