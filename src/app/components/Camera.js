import { Ticker } from 'pixi.js';
import {IPC_CONFIG} from '../config'

export default class Camera { 

    constructor(gameScene, diceRollLog){
        this.camera = gameScene.scene;
        this.scene = gameScene;
        this.diceRollLog = diceRollLog;

        this.moveWithCamera = [];
    }

    startFollowIPC(fastestIPC, maxWidth, finalX, scaleFactor){

        var speed = 0;
        maxWidth /= scaleFactor;
        // const camera = this.camera;

        const followIPC = (delta) => {
            // 
            if (fastestIPC.x + (fastestIPC.sprite.width/(scaleFactor*2)) >=  maxWidth) {
                speed = IPC_CONFIG.base_speed;
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