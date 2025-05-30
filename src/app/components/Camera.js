import { Ticker } from 'pixi.js';
import {IPC_CONFIG, GAME} from '../config'

export default class Camera { 

    constructor(gameScene, diceRollLog){
        this.camera = gameScene.scene;
        this.scene = gameScene;
        this.diceRollLog = diceRollLog;

        this.moveWithCamera = [];
    }

    startFollowIPC(ipcManager, maxWidth, finalX, scaleFactor){

        var speed = 0;
        maxWidth /= scaleFactor;
        // const camera = this.camera;

        const followIPC = (delta) => {
            // 
            var fastestIPC = ipcManager.getFurthestIpc();

            if (fastestIPC.getX() + (fastestIPC.view.sprite.width/(scaleFactor*2)) >=  this.camera.pivot.x + maxWidth) {
                speed = fastestIPC.getX() + (fastestIPC.view.sprite.width/(scaleFactor*2)) -  (this.camera.pivot.x + maxWidth) + GAME.ipc_camera_padding;
                console.log(speed);
            }
            else{
                speed = 0;
            }

            if (this.camera.pivot.x + maxWidth < finalX) {

                this.camera.pivot.x += speed;
                for(var index in this.moveWithCamera){
                    this.moveWithCamera[index].x += speed;
                }
                
                // Clamp if it overshoots
                if (this.camera.pivot.x + maxWidth > finalX) {
                    this.camera.pivot.x = finalX - maxWidth;
                }

                this.diceRollLog?.updateX(this.camera.pivot.x);
            } else {
                // Stop the ticker function once the sprite reaches the target
                Ticker.shared.remove(followIPC);
            }
        };

        // Start the movement
        Ticker.shared.add(followIPC);
    }

    addToMoveWithCamera(obj){
        this.moveWithCamera.push(obj);
    }

}